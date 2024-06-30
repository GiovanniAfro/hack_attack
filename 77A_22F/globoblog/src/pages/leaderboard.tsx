import { api } from "~/utils/api";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { LuCrown } from "react-icons/lu";

export default function LeaderboardPage() {
  const {
    data: users,
    isLoading,
    isError,
    error,
  } = api.user.getLeaderboard.useQuery(undefined, {
    refetchInterval: 30000,
    refetchOnWindowFocus: false,
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isError) {
    return (
      <div className="h-full w-full content-center text-xl text-red-500">
        Internal server error
      </div>
    );
  }

  return (
    <div className="h-pagemax w-full px-8 py-6">
      <Table>
        <TableCaption>Total leaderboard</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="text-center">Pos.</TableHead>
            <TableHead className="text-center">User</TableHead>
            <TableHead className="text-center">Posts</TableHead>
            <TableHead className="text-center">Post ratings</TableHead>
            <TableHead className="text-center">Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users?.map((user, idx) => {
            return (
              <TableRow key={idx}>
                <TableCell className="content-center font-medium">
                  <div className="flex items-center justify-center">
                    {idx + 1}
                  </div>
                </TableCell>
                <TableCell>
                  <div className=" flex items-center justify-center gap-2">
                    <div className="relative flex items-center gap-2">
                      {idx === 0 && (
                        <LuCrown className="absolute -left-8 h-8 w-8 text-yellow-400" />
                      )}
                      <Avatar>
                        <AvatarImage src={user.image ?? ""} />
                        <AvatarFallback>CN</AvatarFallback>
                      </Avatar>
                      <div>{user.name}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center">
                    {user._count.posts}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center">
                    {user._count.postRatings}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center justify-center">
                    {user.points}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
