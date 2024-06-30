import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
  getLeaderboard: publicProcedure
  .query(async ({ctx})=>{
    return await ctx.db.user.findMany({
      orderBy:{ points: "desc"},
      include:{
        _count:{
          select:{
            comments: true,
            posts: true,
            postRatings: true,
          }
        }
      }
    })
  })
});
