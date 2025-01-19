import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Facebook, Twitter, Instagram, Link2, Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface SocialShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  url: string;
  text: string;
}

export const SocialShareDialog = ({
  open,
  onOpenChange,
  title,
  url,
  text
}: SocialShareDialogProps) => {
  const { toast } = useToast();

  const handleShare = async (platform: string) => {
    const shareUrl = encodeURIComponent(url);
    const shareText = encodeURIComponent(text);

    switch (platform) {
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${shareText}&url=${shareUrl}`);
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`);
        break;
      case 'instagram':
        // Open Instagram app with deep linking
        window.location.href = `instagram://camera`;
        setTimeout(() => {
          // Fallback to Instagram website if app doesn't open
          window.location.href = 'https://instagram.com';
        }, 1000);
        break;
      case 'copy':
        try {
          await navigator.clipboard.writeText(url);
          toast({
            title: "Link copied!",
            description: "The link has been copied to your clipboard.",
          });
        } catch (err) {
          toast({
            title: "Failed to copy",
            description: "Please try copying the link manually.",
            variant: "destructive",
          });
        }
        break;
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4 p-4">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => handleShare('twitter')}
          >
            <Twitter className="h-4 w-4" />
            Twitter
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => handleShare('facebook')}
          >
            <Facebook className="h-4 w-4" />
            Facebook
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => handleShare('instagram')}
          >
            <Instagram className="h-4 w-4" />
            Instagram
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={() => handleShare('copy')}
          >
            <Copy className="h-4 w-4" />
            Copy Link
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};