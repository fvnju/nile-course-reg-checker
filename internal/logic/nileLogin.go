package logic

import (
	"io"
	"net/http"
	"net/url"
	"strings"
)

// Error returned when login credentials are invalid
type InvalidCredentialsError struct {
	message string
}

func (e *InvalidCredentialsError) Error() string {
	return e.message
}

func LoginToNileSIS(username, password, session string) error {
	form_data := url.Values{
		"username": {username},
		"password": {password},
		"LogIn":    {"LOGIN"},
	}

	req, err := http.NewRequest("POST", urls["login"], strings.NewReader(form_data.Encode()))
	if err != nil {
		return err
	}

	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")
	req.AddCookie(&http.Cookie{Name: "PHPSESSID", Value: session})
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	// Check for 2xx status codes
	if resp.StatusCode < 200 || resp.StatusCode >= 300 {
		return &sessionError{message: resp.Status}
	}

	// Read response body to check for login success/failure
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return err
	}

	// Check if the response contains the wrong password error message
	if strings.Contains(string(body), "Student number or password is incorrect") {
		return &InvalidCredentialsError{message: "Student number or password is incorrect"}
	}

	return nil
}
