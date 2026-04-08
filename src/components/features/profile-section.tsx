import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MailIcon, UserIcon } from "lucide-react";

interface ProfileSectionProps {
  name: string;
  email: string;
  image: string;
  providers: string[];
}

const providerLabels: Record<string, string> = {
  google: "Google",
  github: "GitHub",
};

export const ProfileSection = ({
  name,
  email,
  image,
  providers,
}: ProfileSectionProps) => {
  const initials = name
    ? name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserIcon className="size-4" />
          프로필
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-4">
          <Avatar size="lg">
            {image && <AvatarImage src={image} alt={name} />}
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="truncate font-medium">{name || "이름 없음"}</p>
            <p className="flex items-center gap-1 truncate text-sm text-muted-foreground">
              <MailIcon className="size-3 shrink-0" />
              {email}
            </p>
          </div>
        </div>

        <Separator />

        <div>
          <p className="mb-2 text-sm font-medium text-muted-foreground">
            연결된 계정
          </p>
          <div className="flex flex-wrap gap-2">
            {providers.length > 0 ? (
              providers.map((provider) => (
                <Badge key={provider} variant="secondary">
                  {providerLabels[provider] ?? provider}
                </Badge>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                연결된 계정이 없습니다.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
