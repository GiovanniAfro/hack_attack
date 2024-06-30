import { nativeEnum, z } from "zod";

import { Post, NoiseLevel, PostStatus, PrismaClient } from "@prisma/client";

import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { env } from "~/env";
const LOGIN_PTS = 100;

const ADD_POST_PTS = 1000;
const ADD_COMMENT_PTS = 500;
const RATE_PTS = 100;

const FIRST_UPVOTE_PTS = 10;
const UPVOTE_PTS = 50;

// const DELETE_PTS = 1000;


const searchInputDef = z.object({
  city: z.string().trim().optional(),
  object: z.string().trim().optional(),
  content: z.string().trim().optional(),
  address: z.string().trim().optional(),
  noiseLevel: z.nativeEnum(NoiseLevel).optional(),
});
type SearchInput = z.infer<typeof searchInputDef>

function getSearchParamsArray(input: SearchInput) {
  const searchParams = [];
  if (input.city && input.city.length) {
    searchParams.push({ city: { contains: input.city, mode: "insensitive" } })
  }
  if (input.address && input.address.length) {
    searchParams.push({ address: { contains: input.address, mode: "insensitive" } })
  }
  if (input.object && input.object.length) {
    searchParams.push({ content: { contains: input.object, mode: "insensitive" } })
  }
  if (input.content && input.content.length) {
    searchParams.push({ content: { contains: input.content, mode: "insensitive" } })
  }
  if (input.noiseLevel && input.noiseLevel.length) {
    searchParams.push({ noiseLevel: { equals: input.noiseLevel } })
  }
  return searchParams;
}

async function getPost(prisma:PrismaClient, postId: number){
  return await prisma.post.findFirst({
    where:{
      id: postId
    },

    include: {
      createdBy: { select: { email: true, id: true, image: true, name: true } },
      postRatings: { select: { ratingType: true, createdAt: true, createdById: true } }
    },
  })
}

export const postRouter = createTRPCRouter({

  // create method: create a new post
  create: protectedProcedure
    .input(z.object({
      object: z.string().trim().min(1),
      content: z.string().trim().min(1),
      address:z.string().trim().min(0),
      city:z.string().trim().min(0),
      noiseLevel: z.nativeEnum(NoiseLevel),
      latitude: z.number(),
      longitude: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          points: {
            increment: ADD_POST_PTS,
          },
        },
      });

      return await ctx.db.post.create({
        data: {
          ...input,
          address: input.address,
          city: input.city,
          status: PostStatus.OPEN,
          createdBy: {
            connect: { id: ctx.session.user.id }
          }
        },
      });
    }),

  // addComment : add a comment to a post
  addComment: protectedProcedure
    .input(z.object({
      content: z.string().trim().min(1),
      postId: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.findFirst({ where: { id: input.postId } })
      if (!post) {
        throw new TRPCError({ message: "Post not found", code: "NOT_FOUND" })
      }

      await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: {
          points: {
            increment: ADD_COMMENT_PTS,
          },
        },
      });

      return ctx.db.comment.create({
        data: {
          content: input.content,
          post: {
            connect: { id: input.postId }
          },
          createdBy: {
            connect: { id: ctx.session.user.id }
          }
        },
        include: {

          createdBy: { select: { email: true, id: true, image: true, name: true } },
          post: {
            include: {
              createdBy: { select: { email: true, id: true, image: true, name: true } },
              postRatings: { select: { ratingType: true, createdAt: true } }

            }
          }
        }
      });
    }),

  // ratePost method : rate a post
  ratePost: protectedProcedure
    .input(z.object({
      postId: z.number(),
      upvote: z.boolean(),
    }))
    .mutation(async ({ ctx, input }) => {
      const post = await ctx.db.post.findFirst({ where: { id: input.postId } })
      if (!post) {
        throw new TRPCError({ message: "Post not found", code: "NOT_FOUND" })
      }
      const existingRating = await ctx.db.postRating.findFirst({ where: { postId: input.postId, createdById: ctx.session.user.id } })
      const totalUpvotes = await ctx.db.postRating.count({ where: { postId: input.postId, ratingType: "UPVOTE" } })

      let newPoints = 0;
      if (totalUpvotes === 0) {
        newPoints = FIRST_UPVOTE_PTS;
      }

      if (existingRating) {
        if (totalUpvotes !== 0 && (totalUpvotes) % 10 === 0) {
          newPoints = UPVOTE_PTS;
        }
        if ((existingRating.ratingType === "UPVOTE" && input.upvote) || (existingRating.ratingType === "DOWNVOTE" && !input.upvote)) {
          await ctx.db.user.update({
            where: { id: ctx.session.user.id },
            data: {
              points: {
                decrement: RATE_PTS,
              },
            },
          });
          //-----------------------------------------------
          await ctx.db.user.update({
            where: { id: existingRating.createdById },
            data: {
              points: {
                decrement: newPoints,
              },
            },
          });
          await ctx.db.postRating.delete({
            where: { id: existingRating.id }, include: {
              createdBy: { select: { email: true, id: true, image: true, name: true } },
              post: {
                include: {
                  createdBy: { select: { email: true, id: true, image: true, name: true } },
                  postRatings: { select: { ratingType: true, createdAt: true, createdById: true } }
                }
              }
            }
          });
          //-----------------------------------------------
          return await getPost(ctx.db, input.postId)
        }


        await ctx.db.user.update({
          where: { id: ctx.session.user.id },
          data: {
            points: {
              increment: RATE_PTS
            },
          },
        });

        await ctx.db.user.update({
          where: { id: existingRating.createdById },
          data: {
            points: {
              increment: newPoints,
            },
          },
        });
        await ctx.db.postRating.update({
          where:{id: existingRating.id},
          data:{ratingType: input.upvote ? "UPVOTE" : "DOWNVOTE"}
        })
        return await getPost(ctx.db, input.postId)
      }
      await ctx.db.postRating.upsert({
        where: { id: input.postId, createdById: ctx.session.user.id },
        update: {
          ratingType: input.upvote ? "UPVOTE" : "DOWNVOTE",
        },
        create: {
          ratingType: input.upvote ? "UPVOTE" : "DOWNVOTE",
          post: {
            connect: { id: input.postId }
          },
          createdBy: {
            connect: { id: ctx.session.user.id }
          }
        },
      });
      return await getPost(ctx.db, input.postId)
    }),

  // search Method: search by text in object, content, address, city.
  search: publicProcedure
    .input(z.object({
      text: z.string().trim().min(0),
    }))
    .query(async ({ ctx, input }) => {
      return ctx.db.post.findMany({
        where: {
          OR: [
            { object: { contains: input.text, mode: "insensitive" } },
            { content: { contains: input.text, mode: "insensitive" } },
            { address: { contains: input.text, mode: "insensitive" } },
            { city: { contains: input.text, mode: "insensitive" } },
          ],
        },
        include: {
          createdBy: { select: { email: true, id: true, image: true, name: true } },
          postRatings: { select: { ratingType: true, createdAt: true, createdById: true } }
        },
      });
    }),

  // advancedSearch Method: filtered research by city, object, content, address.
  advancedSearch: publicProcedure
    .input(z.object({
      city: z.string().trim().optional(),
      object: z.string().trim().optional(),
      content: z.string().trim().optional(),
      address: z.string().trim().optional(),
      noiseLevel: z.nativeEnum(NoiseLevel).optional(),
    }))
    .query(async ({ ctx, input }) => {

      const searchParams = getSearchParamsArray(input);

      return ctx.db.post.findMany({
        where: {
          AND: searchParams as never[],
        },
        include: {
          createdBy: { select: { email: true, id: true, image: true, name: true } },
          postRatings: { select: { ratingType: true, createdAt: true, createdById: true } }
        },
      });
    }),

  // getPost : get a post by id
  getPost: publicProcedure
    .input(z.object({
      postId: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      return ctx.db.post.findFirst({
        where: {
          id: input.postId
        },
        include: {
          createdBy: { select: { email: true, id: true, image: true, name: true } },
          postRatings: { select: { ratingType: true, createdAt: true, createdById: true } }
        }
      });
    }),

  // getComments : get all comments for a post
  getComments: publicProcedure
    .input(z.object({
      postId: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      return ctx.db.comment.findMany({
        where: {
          postId: input.postId
        },
        include: {
          createdBy: { select: { email: true, id: true, image: true, name: true } },
          post: {
            include: {
              createdBy: { select: { email: true, id: true, image: true, name: true } },
              postRatings: { select: { ratingType: true, createdAt: true, createdById: true } }
            }
          }
        }
      });
    }),

  // getPostRating method : get total ratings for a post
  getPostRating: publicProcedure
    .input(z.object({
      postId: z.number(),
    }))
    .query(async ({ ctx, input }) => {
      return ctx.db.postRating.findMany({
        where: {
          postId: input.postId
        },
        include: {
          post: true
        }
      });
    }),

  getLatest10: publicProcedure
    .input(z.object({
      city: z.string().trim().optional(),
      object: z.string().trim().optional(),
      content: z.string().trim().optional(),
      address: z.string().trim().optional(),
      noiseLevel: z.nativeEnum(NoiseLevel).optional(),
    }))
    .query(({ ctx, input }) => {

      const searchParams = getSearchParamsArray(input);

      return ctx.db.post.findMany({
        orderBy: { createdAt: "desc" },
        take: 10,
        include: {
          createdBy: { select: { email: true, id: true, image: true, name: true } },
          postRatings: { select: { ratingType: true, createdAt: true, createdById: true } }
        },
        where: {
          AND: searchParams as never[]
        }
      });
    }),

});
