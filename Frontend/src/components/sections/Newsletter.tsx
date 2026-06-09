import { useState } from "react"
import { useForm } from "react-hook-form"
import { Loader2, CheckCircle2 } from "lucide-react"
import Button from "../ui/Button"
import Input from "../ui/Input"
import Select from "../ui/Select"
import SectionHeading from "../ui/SectionHeading"

interface NewsletterForm {
  email: string;
  interest: string;
}

export default function Newsletter() {
  const [isSuccess, setIsSuccess] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<NewsletterForm>({
    defaultValues: {
      email: "",
      interest: "",
    },
  })

  const onSubmit = async (data: NewsletterForm) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log("Newsletter submission:", data)
    setIsSuccess(true)
  }

  return (
    <section className="bg-gray-100 py-24">
      <div className="mx-auto max-w-[1280px] px-4">
        <div className="bg-white border-y border-border-light shadow-md overflow-hidden relative">
          <div className="mx-auto flex max-w-[896px] flex-col items-center gap-4 px-6 md:px-16 py-16 md:py-20 transition-all duration-500">
            {isSuccess ? (
              <div className="flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                  <CheckCircle2 size={32} />
                </div>
                <SectionHeading
                  title="Thank You!"
                  subtitle="You've successfully subscribed to our newsletter. Get ready for amazing events delivered straight to your inbox."
                />
                <Button 
                  variant="secondary" 
                  onClick={() => setIsSuccess(false)}
                  className="mt-2"
                >
                  Back to Newsletter
                </Button>
              </div>
            ) : (
              <>
                <SectionHeading
                  title="Stay Event Ready"
                  subtitle="Subscribe to our newsletter to receive updates on events based on your interests."
                />

                <form 
                  onSubmit={handleSubmit(onSubmit)}
                  className="w-full max-w-[672px] pt-4 flex flex-col md:flex-row gap-3"
                >
                  <div className="flex-1">
                    <Input
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      register={register}
                      registerOptions={{
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Invalid email address",
                        },
                      }}
                      error={errors.email}
                      disabled={isSubmitting}
                      fullWidth
                    />
                  </div>

                  <Select
                    name="interest"
                    placeholder="Select Interest"
                    options={[
                      { value: "technology", label: "Technology" },
                      { value: "business", label: "Business" },
                      { value: "design", label: "Design" },
                      { value: "marketing", label: "Marketing" },
                    ]}
                    register={register}
                    registerOptions={{
                      required: "Interest is required",
                    }}
                    error={errors.interest}
                    disabled={isSubmitting}
                    fullWidth
                  />

                  <Button 
                    type="submit" 
                    size="lg" 
                    disabled={isSubmitting}
                    className="min-w-[140px]"
                  >
                    {isSubmitting ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      "Subscribe"
                    )}
                  </Button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
