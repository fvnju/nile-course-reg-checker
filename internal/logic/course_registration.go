package logic

import (
	"net/http"
	"regexp"
	"strconv"
	"strings"
	"time"

	"github.com/gocolly/colly/v2"
)

type RegistrationStatus string

const (
	StatusOpen   RegistrationStatus = "OPEN"
	StatusClosed RegistrationStatus = "CLOSED"
)

type ApprovalStatus string

const (
	ApprovalApproved ApprovalStatus = "APPROVED"
	ApprovalPending  ApprovalStatus = "PENDING"
	ApprovalWaiting  ApprovalStatus = "WAITING_FOR_APPROVAL"
)

type RegisteredCourse struct {
	Code    string `json:"code"`
	Name    string `json:"name"`
	Section string `json:"section"`
	Credit  uint8  `json:"credit"`
}

type CourseRegistrationResponse struct {
	RegistrationStatus RegistrationStatus `json:"registrationStatus"`
	ApprovalStatus     ApprovalStatus     `json:"approvalStatus"`
	Semester           string             `json:"semester"`
	Courses            []RegisteredCourse `json:"courses"`
	TotalCredits       uint8              `json:"totalCredits"`
}

func ScrapeCourseRegistration(username, session string) (*CourseRegistrationResponse, error) {
	c := colly.NewCollector()

	c.SetCookies(urls["course_reg"], []*http.Cookie{
		{Name: "uname", Value: username},
		{Name: "PHPSESSID", Value: session},
	})

	response := &CourseRegistrationResponse{
		RegistrationStatus: StatusOpen, // Default to open, will be set to closed if found
		ApprovalStatus:     ApprovalPending,
		Courses:            make([]RegisteredCourse, 0),
	}

	// Check for registration closed status
	c.OnHTML("div.error", func(e *colly.HTMLElement) {
		text := strings.ToLower(e.Text)
		if strings.Contains(text, "closed") {
			response.RegistrationStatus = StatusClosed
		}
	})

	// Check for approval status
	c.OnHTML("div", func(e *colly.HTMLElement) {
		text := e.Text
		style := e.Attr("style")

		// Check for green colored text indicating approval
		if strings.Contains(style, "color:green") || strings.Contains(style, "color: green") {
			textLower := strings.ToLower(text)
			if strings.Contains(textLower, "approved") {
				response.ApprovalStatus = ApprovalApproved
			}
		}
	})

	// Extract semester from title
	c.OnHTML("div.modTitle h4, .modTitle h4", func(e *colly.HTMLElement) {
		text := e.Text
		// Extract semester like "2025 - 1" from "Course Registration (2025 - 1)"
		re := regexp.MustCompile(`\(([^)]+)\)`)
		matches := re.FindStringSubmatch(text)
		if len(matches) > 1 {
			response.Semester = strings.TrimSpace(matches[1])
		}
	})

	// Parse registered courses from table
	c.OnHTML("table.table tbody tr", func(e *colly.HTMLElement) {
		// Skip header rows or rows without course data
		codeText := e.ChildText("td:nth-child(2)")
		if codeText == "" {
			return
		}

		// Clean up the code (remove leading dots and whitespace)
		code := strings.TrimSpace(strings.TrimPrefix(codeText, "."))
		section := strings.TrimSpace(e.ChildText("td:nth-child(3)"))
		name := strings.TrimSpace(e.ChildText("td:nth-child(4)"))
		creditStr := strings.TrimSpace(e.ChildText("td:nth-child(5)"))

		// Skip if this looks like a total row
		if strings.Contains(strings.ToLower(e.Text), "total credit") {
			return
		}

		credit, err := strconv.ParseInt(creditStr, 10, 8)
		if err != nil {
			return
		}

		response.Courses = append(response.Courses, RegisteredCourse{
			Code:    code,
			Name:    name,
			Section: section,
			Credit:  uint8(credit),
		})
	})

	// Calculate total credits
	c.OnScraped(func(r *colly.Response) {
		var total uint8 = 0
		for _, course := range response.Courses {
			total += course.Credit
		}
		response.TotalCredits = total
	})

	timeout, _ := time.ParseDuration("40s")
	c.SetRequestTimeout(timeout)

	err := c.Visit(urls["course_reg"])
	if err != nil {
		return nil, err
	}

	return response, nil
}
