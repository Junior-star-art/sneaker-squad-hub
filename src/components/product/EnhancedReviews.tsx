import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Star, ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface ReviewProps {
  productId: string;
}

export const EnhancedReviews = ({ productId }: ReviewProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedRating, setSelectedRating] = useState(0);
  const [comment, setComment] = useState("");

  const { data: reviews, refetch } = useQuery({
    queryKey: ["product-reviews", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_reviews")
        .select(`
          *,
          profiles:profiles(full_name, avatar_url)
        `)
        .eq("product_id", productId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleVote = async (reviewId: string, isHelpful: boolean) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to vote on reviews",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from("product_reviews")
      .update({
        helpful_votes: isHelpful ? reviews?.find(r => r.id === reviewId)?.helpful_votes + 1 : reviews?.find(r => r.id === reviewId)?.helpful_votes,
        not_helpful_votes: !isHelpful ? reviews?.find(r => r.id === reviewId)?.not_helpful_votes + 1 : reviews?.find(r => r.id === reviewId)?.not_helpful_votes,
      })
      .eq("id", reviewId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to register your vote",
        variant: "destructive",
      });
      return;
    }

    refetch();
    toast({
      title: "Vote registered",
      description: "Thank you for your feedback!",
    });
  };

  const submitReview = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit a review",
        variant: "destructive",
      });
      return;
    }

    if (selectedRating === 0) {
      toast({
        title: "Rating required",
        description: "Please select a rating before submitting",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase.from("product_reviews").insert({
      product_id: productId,
      user_id: user.id,
      rating: selectedRating,
      comment,
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit review",
        variant: "destructive",
      });
      return;
    }

    setSelectedRating(0);
    setComment("");
    refetch();
    toast({
      title: "Review submitted",
      description: "Thank you for your review!",
    });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Customer Reviews</h3>
        
        {user && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium">Write a Review</h4>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <button
                  key={rating}
                  onClick={() => setSelectedRating(rating)}
                  className="focus:outline-none"
                >
                  <Star
                    className={`w-6 h-6 ${
                      rating <= selectedRating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this product..."
              className="w-full p-2 border rounded-md"
              rows={4}
            />
            <Button onClick={submitReview}>Submit Review</Button>
          </div>
        )}

        <div className="space-y-6">
          {reviews?.map((review: any) => (
            <div key={review.id} className="border-b pb-6">
              <div className="flex items-center gap-4 mb-4">
                <Avatar>
                  <AvatarImage
                    src={review.profiles?.avatar_url}
                    alt={review.profiles?.full_name || "User"}
                  />
                  <AvatarFallback>
                    {(review.profiles?.full_name || "User")
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">
                      {review.profiles?.full_name || "Anonymous"}
                    </p>
                    {review.verified_purchase && (
                      <Badge variant="secondary" className="text-xs">
                        Verified Purchase
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star
                          key={index}
                          className={`w-4 h-4 ${
                            index < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(review.created_at), {
                        addSuffix: true,
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-gray-600 mb-4">{review.comment}</p>
              {review.media_urls && review.media_urls.length > 0 && (
                <div className="flex gap-2 mb-4">
                  {review.media_urls.map((url: string, index: number) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Review image ${index + 1}`}
                      className="w-20 h-20 object-cover rounded"
                    />
                  ))}
                </div>
              )}
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVote(review.id, true)}
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Helpful ({review.helpful_votes || 0})
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVote(review.id, false)}
                >
                  <ThumbsDown className="w-4 h-4 mr-2" />
                  Not Helpful ({review.not_helpful_votes || 0})
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
