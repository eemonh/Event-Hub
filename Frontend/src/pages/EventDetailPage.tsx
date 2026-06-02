import { useParams, useNavigate } from "react-router-dom"
import { useState } from "react"
import {
  CalendarDays, MapPin, Users, Bookmark, ArrowRight,
  ShieldCheck, Code2, Loader2, Ticket, ArrowLeft, User, Clock, Star,
  ThumbsUp, MessageCircle, Trash2, Send,
} from "lucide-react"
import toast from "react-hot-toast"
import { useAuth } from "../context/AuthContext"
import { useEvent, useMyEvents, useSavedEvents, useComments } from "../hooks/queries/useEvents"
import {
  useRegisterForEvent, useBookmarkEvent, useRemoveBookmark,
  useToggleUpvote, useAddComment, useDeleteComment,
} from "../hooks/mutations/useEventMutations"
import { EventDetailSkeleton } from "../components/ui/Skeletons"

const SCHEDULE_ICONS = [
  { icon: Clock, bg: "bg-[#F3EAFE]", color: "text-primary" },
  { icon: ShieldCheck, bg: "bg-[#EEF3FF]", color: "text-[#5B67F1]" },
  { icon: Code2, bg: "bg-[#FFF1E8]", color: "text-[#D57B35]" },
  { icon: CalendarDays, bg: "bg-[#E6F7EC]", color: "text-[#2B8F4E]" },
  { icon: Clock, bg: "bg-[#FEF3E2]", color: "text-[#C07A1F]" },
  { icon: MapPin, bg: "bg-[#F0E6FF]", color: "text-[#8B4DE6]" },
  { icon: Users, bg: "bg-[#FFE8E8]", color: "text-[#D64444]" },
  { icon: Star, bg: "bg-[#E8F4FF]", color: "text-[#3B82F6]" },
]

export default function EventDetailPage() {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const { user, token } = useAuth()
  const { data, isLoading, error } = useEvent(eventId)
  const { data: myEventsData } = useMyEvents()
  const { data: savedData } = useSavedEvents()
  const [commentText, setCommentText] = useState("")
  const registerMutation = useRegisterForEvent()
  const bookmarkMutation = useBookmarkEvent()
  const removeBookmarkMutation = useRemoveBookmark()
  const upvoteMutation = useToggleUpvote()
  const addCommentMutation = useAddComment()
  const deleteCommentMutation = useDeleteComment()
  const { data: commentsData } = useComments(eventId)

  const event = data?.event || null

  const myEventIds = new Set((myEventsData?.events || []).map((e) => e._id || e.id))
  const savedEventIds = new Set((savedData?.events || []).map((e) => e._id || e.id))

  const isOwner = event?.organizer?._id === user?.id
  const isRegistered = myEventIds.has(eventId)
  const isSaved = savedEventIds.has(eventId)
  const isUpvoted = event?.userUpvoted
  const comments = commentsData?.comments || []

  const handleRegister = async () => {
    if (!token) return toast.error("Please log in to register")
    registerMutation.mutate(eventId, {
      onSuccess: () => toast.success("Registered successfully!"),
      onError: (err) => toast.error(err.message),
    })
  }

  const handleBookmark = async () => {
    if (!token) return toast.error("Please log in to bookmark")
    if (isSaved) {
      removeBookmarkMutation.mutate(eventId, {
        onSuccess: () => toast.success("Bookmark removed"),
        onError: (err) => toast.error(err.message),
      })
    } else {
      bookmarkMutation.mutate(eventId, {
        onSuccess: () => toast.success("Event saved!"),
        onError: (err) => toast.error(err.message),
      })
    }
  }

  const handleUpvote = () => {
    if (!token) return toast.error("Please log in to upvote")
    upvoteMutation.mutate(eventId, {
      onError: (err) => toast.error(err.message),
    })
  }

  const handleAddComment = (e) => {
    e.preventDefault()
    if (!token) return toast.error("Please log in to comment")
    if (!commentText.trim()) return toast.error("Comment cannot be empty")
    addCommentMutation.mutate(
      { eventId, text: commentText.trim() },
      {
        onSuccess: () => {
          setCommentText("")
          toast.success("Comment added!")
        },
        onError: (err) => toast.error(err.message),
      },
    )
  }

  const handleDeleteComment = (commentId) => {
    deleteCommentMutation.mutate(
      { eventId, commentId },
      { onError: (err) => toast.error(err.message) },
    )
  }

  const formatDate = (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      weekday: "short", year: "numeric", month: "short", day: "numeric",
    })

  if (isLoading) {
    return <EventDetailSkeleton />
  }

  if (error || !event) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#F6F1F7] gap-4 px-4">
        <p className="text-lg font-medium text-[#5D6475]">{error?.message || "Event not found"}</p>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white hover:bg-primary-hover"
        >
          <ArrowLeft size={16} /> Go Back
        </button>
      </div>
    )
  }

  const actionLoading = registerMutation.isPending
    ? "register" : bookmarkMutation.isPending
    ? "bookmark" : upvoteMutation.isPending
    ? "upvote" : null

  return (
    <div className="min-h-screen bg-[#F6F1F7] px-4 py-8 md:px-8">
      <div className="mx-auto max-w-[1180px]">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-primary hover:text-primary-hover"
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]">
          <div className="overflow-hidden rounded-[14px] border border-[#DAD4DD] bg-black shadow-sm h-[400px]">
            <img
              src={event.coverImage || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1600&auto=format&fit=crop"}
              alt={event.name}
              onError={(e) => {
                e.target.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1600&auto=format&fit=crop"
              }}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="self-start rounded-[14px] border border-[#DDD6E1] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <p className="text-[11px] font-semibold text-[#5BCE8E]">
              {isRegistered ? "You are registered" : "Registrations Open"}
            </p>
            <h2 className="mt-1 text-[38px] font-bold leading-none tracking-[-1px] text-[#121826]">
              {event.price === 0 || !event.price ? "Free" : `$${event.price}`}
            </h2>
            <p className="mt-1 text-[13px] text-[#7E8495]">General Admission</p>
            <div className="my-5 border-t border-[#ECE8EF]" />

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <CalendarDays size={16} className="mt-[2px] text-primary" />
                <div>
                  <p className="text-[13px] font-medium text-[#1C2333]">
                    {formatDate(event.startDate)}
                    {event.endDate && event.endDate !== event.startDate ? ` - ${formatDate(event.endDate)}` : ""}
                  </p>
                  <p className="text-[12px] text-[#8B90A0]">
                    {event.startTime || "All day"}{event.endTime ? ` - ${event.endTime}` : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin size={16} className="mt-[2px] text-primary" />
                <div>
                  <p className="text-[13px] font-medium text-[#1C2333]">{event.venue || "TBD"}</p>
                  <p className="text-[12px] leading-5 text-[#8B90A0]">In-Person Event</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users size={16} className="mt-[2px] text-primary" />
                <div>
                  <p className="text-[13px] font-medium text-[#1C2333]">Available Seats</p>
                  <p className="text-[12px] text-[#8B90A0]">
                    {event.registrationCount ?? 0} / {event.capacity || "∞"} registered
                  </p>
                </div>
              </div>
            </div>

            {isOwner ? (
              <button disabled className="mt-7 flex h-[50px] w-full items-center justify-center gap-2 rounded-[10px] bg-slate-100 text-[15px] font-semibold text-slate-500">
                <User size={16} /> You are the organizer
              </button>
            ) : isRegistered ? (
              <button disabled className="mt-7 flex h-[50px] w-full items-center justify-center gap-2 rounded-[10px] bg-emerald-100 text-[15px] font-semibold text-emerald-700">
                <Ticket size={16} /> Registered
              </button>
            ) : (
              <button
                onClick={handleRegister}
                disabled={actionLoading === "register"}
                className="mt-7 flex h-[50px] w-full items-center justify-center gap-2 rounded-[10px] bg-primary text-[15px] font-semibold text-white transition hover:bg-primary-hover disabled:opacity-60"
              >
                {actionLoading === "register" ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                Register Now
              </button>
            )}

            <button
              onClick={handleUpvote}
              disabled={actionLoading === "upvote"}
              className={`mt-3 flex h-[48px] w-full items-center justify-center gap-2 rounded-[10px] border text-[14px] font-medium transition disabled:opacity-60 ${
                isUpvoted
                  ? "border-primary/30 bg-primary/5 text-primary"
                  : "border-[#E6E1E9] bg-[#FAFAFB] text-[#31394C] hover:bg-[#F2F3F5]"
              }`}
            >
              {actionLoading === "upvote" ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <ThumbsUp size={15} className={isUpvoted ? "fill-primary" : ""} />
              )}
              Upvote {event.upvoteCount > 0 && `(${event.upvoteCount})`}
            </button>

            <button
              onClick={handleBookmark}
              disabled={actionLoading === "bookmark"}
              className={`mt-3 flex h-[48px] w-full items-center justify-center gap-2 rounded-[10px] border text-[14px] font-medium transition disabled:opacity-60 ${
                isSaved
                  ? "border-primary/30 bg-primary/5 text-primary"
                  : "border-[#E6E1E9] bg-[#FAFAFB] text-[#31394C] hover:bg-[#F2F3F5]"
              }`}
            >
              {actionLoading === "bookmark" ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Bookmark size={15} className={isSaved ? "fill-primary" : ""} />
              )}
              {isSaved ? "Saved" : "Save for Later"}
            </button>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
          <div>
            <div className="flex items-center gap-2">
              {event.category && (
                <span className="rounded-full bg-primary/10 px-3 py-[5px] text-[11px] font-medium text-primary">{event.category}</span>
              )}
              {event.type && (
                <span className="rounded-full bg-gray-100 px-3 py-[5px] text-[11px] font-medium text-text-muted">{event.type}</span>
              )}
            </div>

            <h1 className="mt-4 max-w-[700px] text-[52px] font-extrabold leading-[1.02] tracking-[-2px] text-[#131927]">
              {event.name}
            </h1>

            {event.subtitle && (
              <p className="mt-5 max-w-[720px] text-[20px] leading-[1.55] text-[#5D6475]">{event.subtitle}</p>
            )}

            {event.description && (
              <>
                <div className="mt-10 border-t border-[#E5DEE8]" />
                <section className="mt-10">
                  <h2 className="text-[36px] font-bold tracking-[-1px] text-[#141B2A]">About This Event</h2>
                  <div className="mt-6 max-w-[760px] space-y-6 text-[15px] leading-8 text-[#676E7E]">
                    {event.description.split("\n").map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                  </div>
                </section>
              </>
            )}

            {event.schedule?.length > 0 && (
              <section className="mt-20">
                <h2 className="text-[36px] font-bold tracking-[-1px] text-[#141B2A]">Schedule Highlights</h2>
                <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
                  {event.schedule.map((item, i) => {
                    const iconIndex = i % 8
                    const iconConfig = SCHEDULE_ICONS[iconIndex]
                    const IconComponent = iconConfig.icon
                    return (
                      <div key={i} className="rounded-[14px] border border-[#E7E1EA] bg-white p-5 shadow-[0_2px_6px_rgba(0,0,0,0.03)]">
                        <div className="flex items-start justify-between">
                          <div>
                            {(item.day || item.time) && (
                              <p className="text-[12px] font-semibold uppercase tracking-wide text-primary">
                                {item.day && `${item.day}`}{item.day && item.time ? " • " : ""}{item.time}
                              </p>
                            )}
                            {item.title && <h3 className="mt-2 text-[24px] font-bold text-[#1A2233]">{item.title}</h3>}
                          </div>
                          <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconConfig.bg}`}>
                            <IconComponent size={16} className={iconConfig.color} />
                          </div>
                        </div>
                        {item.description && <p className="mt-5 text-[14px] leading-7 text-[#72798B]">{item.description}</p>}
                      </div>
                    )
                  })}
                </div>
              </section>
            )}

            <div className="mt-20 border-t border-[#E5DEE8]" />

            {event.organizer && (
              <section className="mt-14">
                <h2 className="text-[36px] font-bold tracking-[-1px] text-[#141B2A]">Organizer</h2>
                <div className="mt-8 flex items-center gap-5 rounded-[14px] border border-[#E7E1EA] bg-white p-5 shadow-[0_2px_6px_rgba(0,0,0,0.03)]">
                  <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-primary/10">
                    <User size={28} className="text-primary" />
                  </div>
                  <div>
                    <h3 className="text-[20px] font-bold text-[#1B2233]">{event.organizer.name}</h3>
                    <p className="mt-1 text-[14px] text-[#707789]">{event.organizer.email || "Event organizer"}</p>
                  </div>
                </div>
              </section>
            )}

            <section className="mt-14 pb-20">
              <div className="flex items-center gap-2">
                <h2 className="text-[36px] font-bold tracking-[-1px] text-[#141B2A]">Comments</h2>
                {event.commentCount > 0 && (
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">{event.commentCount}</span>
                )}
              </div>

              <div className="mt-8 space-y-4">
                {token ? (
                  <form onSubmit={handleAddComment} className="flex gap-3">
                    <input
                      type="text"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Write a comment..."
                      maxLength={1000}
                      className="flex-1 rounded-[10px] border border-[#E6E1E9] bg-white px-4 py-3 text-sm text-[#31394C] placeholder-[#9CA3AF] outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/10"
                    />
                    <button
                      type="submit"
                      disabled={addCommentMutation.isPending || !commentText.trim()}
                      className="flex h-[46px] w-[46px] items-center justify-center rounded-[10px] bg-primary text-white transition hover:bg-primary-hover disabled:opacity-50"
                    >
                      {addCommentMutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                    </button>
                  </form>
                ) : (
                  <p className="text-sm text-[#8B90A0]">Please log in to leave a comment.</p>
                )}

                {comments.length === 0 ? (
                  <p className="pt-4 text-sm text-[#8B90A0]">No comments yet. Be the first to share your thoughts!</p>
                ) : (
                  <div className="space-y-3 pt-2">
                    {comments.map((comment) => (
                      <div key={comment._id} className="rounded-[12px] border border-[#E7E1EA] bg-white p-4 shadow-[0_1px_4px_rgba(0,0,0,0.03)]">
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                              <User size={14} className="text-primary" />
                            </div>
                            <div>
                              <p className="text-[13px] font-semibold text-[#1A2233]">{comment.user?.name || "Anonymous"}</p>
                              <p className="text-[11px] text-[#8B90A0]">
                                {new Date(comment.createdAt).toLocaleDateString("en-US", {
                                  month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
                                })}
                              </p>
                            </div>
                          </div>
                          {user?.id === comment.user?._id && (
                            <button
                              onClick={() => handleDeleteComment(comment._id)}
                              className="text-[#8B90A0] transition hover:text-red-500"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>
                        <p className="mt-3 text-[14px] leading-6 text-[#5D6475]">{comment.text}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>

          <div>
            <div className="sticky top-6 overflow-hidden rounded-[16px] border border-[#D9D3DD] bg-[#7A8897] shadow-[0_6px_20px_rgba(0,0,0,0.08)]">
              <div className="relative flex h-[360px] items-center justify-center">
                <div className="relative flex h-[250px] w-[250px] items-center justify-center overflow-hidden rounded-full bg-cover bg-center shadow-2xl"
                  style={{
                    backgroundImage: `url(https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1200&auto=format&fit=crop)`,
                  }}
                >
                  <div className="absolute inset-0 rounded-full bg-black/15" />
                  <div className="absolute h-5 w-5 rounded-full bg-primary z-10" />
                  <div className="absolute bottom-[78px] z-10 rounded-full bg-white px-4 py-2 text-[13px] font-medium text-[#1A2233] shadow-lg">
                    <div className="flex items-center gap-1.5">
                      <MapPin size={14} className="text-primary" />
                      {event.venue || "Venue"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
