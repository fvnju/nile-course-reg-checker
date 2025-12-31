import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { motion } from "motion/react";
import { CheckCircle2, Lock, User } from "lucide-react";
import { checkCourseRegistration } from "../../utils/api";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Card } from "../components/ui/Card";

export default function Home() {
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: () => checkCourseRegistration(studentId, password),
    onSuccess: (data) => {
      navigate("/result", { state: { data } });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !password) return;
    mutation.mutate();
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl shadow-blue-900/5">
          <div className="mb-8 text-center flex flex-col items-center">
            <div className="bg-blue-100 p-3 rounded-2xl mb-4 text-[var(--color-primary)]">
              <CheckCircle2 size={32} />
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Nile Registration Check
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Enter your student details to check your status
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <Input
                  label="Student ID"
                  placeholder="e.g. 12345"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="pl-10"
                  required
                />
                <User className="absolute left-3 bottom-3.5 text-slate-400 h-5 w-5 pointer-events-none" />
              </div>

              <div className="relative">
                <Input
                  label="SIS Password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                />
                <Lock className="absolute left-3 bottom-3.5 text-slate-400 h-5 w-5 pointer-events-none" />
              </div>
            </div>

            {mutation.isError && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="rounded-lg bg-red-50 p-3 text-sm text-red-600"
              >
                {mutation.error.message}
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full"
              isLoading={mutation.isPending}
            >
              Check Status
            </Button>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
