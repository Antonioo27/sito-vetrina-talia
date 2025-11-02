import { postRouter } from "~/server/api/routers/post";
import { productRouter } from "~/server/api/routers/product";
import { authRouter } from "~/server/api/routers/auth";
import { adminRouter } from "~/server/api/routers/admin";
import { typologyRouter } from "~/server/api/routers/typology";
import { wishlistRouter } from "~/server/api/routers/wishlist";
import { contactRouter } from "~/server/api/routers/contact";
import { bannerRouter } from "~/server/api/routers/banner";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  post: postRouter,
  product: productRouter,
  auth: authRouter,
  admin: adminRouter,
  typology: typologyRouter,
  wishlist: wishlistRouter,
  contact: contactRouter,
  banner: bannerRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
