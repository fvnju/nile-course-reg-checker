export type RegistrationData = {
  registrationStatus: string
  approvalStatus: string
  semester: string
  courses: Course[]
  totalCredits: number
}

export type Course = {
  code: string
  name: string
  section: string
  credit: number
}