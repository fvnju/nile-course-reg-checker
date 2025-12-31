import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import {
  ArrowLeft,
  BookOpen,
  Calculator,
  CheckCircle,
  FileWarning,
} from "lucide-react";
import type { RegistrationData } from "../../utils/api.types";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.data as RegistrationData | undefined;

  useEffect(() => {
    if (!data) {
      navigate("/");
    }
  }, [data, navigate]);

  if (!data) return null;

  const isApproved = data.approvalStatus.toLowerCase().includes("approved");
  const isRegistered =
    data.registrationStatus.toLowerCase().includes("open") ||
    data.courses.length > 0;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-12">
      <div className="mx-auto max-w-4xl space-y-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Button
            variant="ghost"
            onClick={() => navigate("/")}
            className="mb-4 pl-0 hover:bg-transparent hover:text-blue-600"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
          </Button>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="h-full border-l-4 border-l-blue-500">
              <h2 className="text-lg font-semibold text-slate-500 mb-1">
                Semester
              </h2>
              <p className="text-3xl font-bold text-slate-900">
                {data.semester}
              </p>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card
              className={`h-full border-l-4 ${
                isApproved ? "border-l-green-500" : "border-l-yellow-500"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-500 mb-1">
                    Status
                  </h2>
                  <p
                    className={`text-2xl font-bold ${
                      isApproved ? "text-green-600" : "text-yellow-600"
                    }`}
                  >
                    {data.approvalStatus}
                  </p>
                </div>
                {isApproved ? (
                  <CheckCircle className="h-10 w-10 text-green-100 text-green-500" />
                ) : (
                  <FileWarning className="h-10 w-10 text-yellow-500" />
                )}
              </div>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="overflow-hidden p-0">
            <div className="bg-slate-50 border-b border-slate-100 p-6 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <BookOpen size={20} />
                </div>
                <h3 className="text-xl font-bold text-slate-800">
                  Registered Courses
                </h3>
              </div>
              <div className="flex items-center gap-2 text-slate-600 bg-white px-3 py-1.5 rounded-md border border-slate-200 shadow-sm">
                <Calculator size={16} />
                <span className="font-medium">
                  Total Credits: {data.totalCredits}
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50/50 text-slate-500">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Code</th>
                    <th className="px-6 py-4 font-semibold">Course Name</th>
                    <th className="px-6 py-4 font-semibold">Section</th>
                    <th className="px-6 py-4 font-semibold text-right">
                      Credit
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.courses.length > 0 ? (
                    data.courses.map((course, index) => (
                      <motion.tr
                        key={course.code}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.05 }}
                        className="hover:bg-slate-50/80 transition-colors"
                      >
                        <td className="px-6 py-4 font-medium text-blue-600">
                          {course.code}
                        </td>
                        <td className="px-6 py-4 text-slate-700">
                          {course.name}
                        </td>
                        <td className="px-6 py-4 text-slate-500">
                          {course.section}
                        </td>
                        <td className="px-6 py-4 text-right font-medium text-slate-700">
                          {course.credit}
                        </td>
                      </motion.tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-12 text-center text-slate-500"
                      >
                        No courses found for this semester.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
