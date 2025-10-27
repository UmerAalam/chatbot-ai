import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import { Provider } from "react-redux";
import { store } from "../app/store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NotFoundPage from "src/pages/NotFoundPage";

import appCss from "../styles.css?url";

const queryClient = new QueryClient();

export const Route = createRootRoute({
  notFoundComponent: NotFoundPage,
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "ChatBot AI",
      },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
});
function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
        <style>
          @import
          url('https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@100..900&family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Rubik:ital,wght@0,300..900;1,300..900&display=swap');
        </style>
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>{children}</Provider>
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  );
}
