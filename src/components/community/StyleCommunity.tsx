import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Camera, Heart, Share2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Post {
  id: number;
  username: string;
  image: string;
  likes: number;
  description: string;
  products: string[];
}

const INITIAL_POSTS: Post[] = [
  {
    id: 1,
    username: "nikeStyle23",
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901",
    likes: 234,
    description: "Perfect outfit for my morning run! 🏃‍♂️",
    products: ["Nike Air Zoom", "Nike Dri-FIT"]
  },
  {
    id: 2,
    username: "fitnessFanatic",
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04",
    likes: 189,
    description: "Style of the Week: Urban Athletic 🏆",
    products: ["Nike Tech Fleece", "Nike Air Max"]
  }
];

const StyleCommunity = () => {
  const [posts, setPosts] = useState<Post[]>(INITIAL_POSTS);
  const { toast } = useToast();
  const [showUpload, setShowUpload] = useState(false);

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, likes: post.likes + 1 } : post
    ));
    toast({
      title: "Post liked!",
      description: "Your like has been recorded.",
    });
  };

  const handleShare = () => {
    toast({
      title: "Sharing...",
      description: "Share feature coming soon!",
    });
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      toast({
        title: "Photo uploaded!",
        description: "Your style will be reviewed and posted soon.",
      });
      setShowUpload(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold">Nike Style Community</h2>
        <Dialog open={showUpload} onOpenChange={setShowUpload}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Camera className="h-4 w-4" />
              Share Your Style
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload Your Style</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="w-full"
              />
              <p className="text-sm text-gray-500">
                Share your Nike style with the community! 
                Make sure your photo clearly shows your Nike products.
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={post.image}
              alt={`Style by ${post.username}`}
              className="w-full h-64 object-cover"
            />
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">@{post.username}</span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleLike(post.id)}
                  >
                    <Heart className="h-4 w-4 mr-1" />
                    {post.likes}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <p className="text-gray-600 mb-2">{post.description}</p>
              <div className="flex flex-wrap gap-2">
                {post.products.map((product) => (
                  <span
                    key={product}
                    className="bg-gray-100 px-2 py-1 rounded-full text-sm text-gray-600"
                  >
                    {product}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StyleCommunity;