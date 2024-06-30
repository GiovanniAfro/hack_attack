import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import {
  BsArrowDown,
  BsArrowUp,
  BsEmojiAngry,
  BsEmojiDizzy,
  BsEmojiExpressionless,
  BsEmojiSmile,
  BsEmojiSunglasses,
} from "react-icons/bs";
import { FunctionComponent, useEffect, useState } from "react";
import { inferRouterOutputs } from "@trpc/server";
import { AppRouter } from "../server/api/root";
import { api } from "~/utils/api";
import { signIn, useSession } from "next-auth/react";
import { PostRatingType } from "@prisma/client";

export type CardPreviewProps = {
  post?: inferRouterOutputs<AppRouter>["post"]["search"][0];
};

export const CardPreview: FunctionComponent<CardPreviewProps> = ({ post: postObj}) => {
  const { data, status } = useSession();
  const [post, setPost] = useState<inferRouterOutputs<AppRouter>["post"]["search"][0] | null>(null);
  const ratePostMutation = api.post.ratePost.useMutation({
    onSuccess(data, variables, context) {
      setPost(data ?? null);
    },
  });

  const [isUpvoted, setIsUpvoted] = useState<boolean | null>(null);

  useEffect(() => {
    setPost(postObj ?? null);
  }, [postObj]);

  useEffect(() => {
    const voting = post?.postRatings.find(
      (el) => el.createdById === data?.user.id,
    );
    if (voting == null) {
      setIsUpvoted(null);
    } else {
      setIsUpvoted(voting?.ratingType === "UPVOTE");
    }
  }, [post]);

  function updateRating(rating: PostRatingType) {
    if (status === "unauthenticated"){
      signIn("discord", {redirect:true})
      return;
    }
      ratePostMutation.mutate({
      postId: post!.id,
      upvote: rating == "UPVOTE",
    });
  }

  if (!post) {
    return <SkeletonCardPreview />;
  }

  return (
    <Card className="h-full w-full p-3">
      <div className="flex h-full min-h-[250px] flex-col">
        <div>
          <h2 className="overflow-hidden overflow-ellipsis text-xl">
            {post.object}
          </h2>
          <h3 className="text-sm text-neutral-400">
            {post.city}, {post.address}
          </h3>
        </div>
        <div className="flex justify-start space-x-4 p-1">
          <Avatar>
            <AvatarImage src={post.createdBy.image ?? ""} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex items-center text-justify">
            <h2>{post.createdBy.name}</h2>
          </div>
        </div>
        <div className="flex h-full grow overflow-ellipsis px-5 py-3 text-justify">
          {post.content}
        </div>
        <div className="flex shrink-0  items-center justify-between">
          <div className="flex justify-center">
            {post.noiseLevel == "SILENT" ? (
              <BsEmojiSunglasses className="h-12 w-12" />
            ) : post.noiseLevel == "LOW" ? (
              <BsEmojiSmile />
            ) : post.noiseLevel == "MEDIUM" ? (
              <BsEmojiExpressionless className="h-12 w-12" />
            ) : post.noiseLevel == "HIGH" ? (
              <BsEmojiDizzy className="h-12 w-12" />
            ) : (
              <BsEmojiAngry className="h-12 w-12" />
            )}
          </div>
          <div className="flex justify-center space-x-4">
            <Button
              disabled={ratePostMutation.isPending}
              title={new Intl.NumberFormat("it-IT").format(
                post.postRatings.reduce(
                  (curr, el) => (el.ratingType === "UPVOTE" ? ++curr : curr),
                  0,
                ),
              )}
              onClick={() => updateRating(PostRatingType.UPVOTE)}
              className={`${isUpvoted === true ? "w-[%20] bg-lime-500 hover:bg-lime-700" : "w-[%20] bg-green-800 hover:bg-green-900"}`}
            >
              <BsArrowUp />
            </Button>
            <Button
              disabled={ratePostMutation.isPending}
              title={new Intl.NumberFormat("it-IT").format(
                post.postRatings.reduce(
                  (curr, el) => (el.ratingType === "UPVOTE" ? ++curr : curr),
                  0,
                ),
              )}
              onClick={() => updateRating(PostRatingType.DOWNVOTE)}
              className={`${isUpvoted === false ? "w-[%20] bg-red-500 hover:bg-red-700" : "w-[%20] bg-red-800 hover:bg-red-900"}`}
            >
              <BsArrowDown />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

function SkeletonCardPreview() {
  return (
    <Card className="h-full w-full p-3">
      <div className="flex h-full min-h-[250px] flex-col">
        <div>
          <h2 className="overflow-hidden overflow-ellipsis text-xl">
            <div className="mb-4 h-2.5 w-32 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          </h2>
          <h3 className="text-sm text-neutral-400">
            <div className="mb-2.5 h-2 max-w-[280px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
          </h3>
        </div>
        <div className="flex justify-start space-x-4 p-1">
          <Avatar>
            <AvatarImage src={""} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div className="flex items-center text-justify">
            <div className="mb-2.5 h-2 w-20 max-w-[360px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>
        <div className="flex h-full grow flex-col overflow-ellipsis px-5 py-3 text-justify">
          <div className="mb-2.5 h-2 w-60 max-w-[360px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="mb-2.5 h-2 w-52 max-w-[360px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="mb-2.5 h-2 w-72 max-w-[360px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
          <div className="w-90 mb-2.5 h-2 max-w-[400px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
        </div>
        <div className="flex shrink-0  items-center justify-between">
          <div className="flex justify-center">
            <div className="mb-2.5 h-2 max-w-[360px] rounded-full bg-gray-200 dark:bg-gray-700"></div>
          </div>
          <div className="flex justify-center space-x-4">
            <div className="h-2.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
            <div className="h-2.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
          </div>
        </div>
      </div>
    </Card>
  );
}
