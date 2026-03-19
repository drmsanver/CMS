import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized({ req, token }) {
      // Protect any route that matches the config below
      return !!token;
    },
  },
});

export const config = { 
  matcher: ["/dashboard/:path*"] 
};
