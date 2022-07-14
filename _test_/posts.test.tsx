import { it } from "vitest";
import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing";
import moment from "moment";
import { InMemoryCache } from "@apollo/client";
import Home from "../pages/home/index.p";
import PostForm from "../components/PostForm";
import DeleteButton from "../components/DeleteButton";
import { FETCH_POSTS } from "../pages/home/gql/queries";
import { CREATE_POST } from "../components/PostForm/gql/mutations";
import { renderWithProviders } from "./utils/reduxProvider";
import { DELETE_POST } from "../components/DeleteButton/gql/mutations";

const mockUser = {
  id: "62c944a5607936e5a39b0cc9",
  username: "Poter",
  createdAt: "2022-07-09T09:04:37.183Z",
  email: "jimmy@gmail.com",
  token: "testToken",
};

const mockPost = {
  id: "62c51c9d4d654949055ab4fe",
  body: "This is test post",
  username: "Poter",
  createdAt: "Wed Jul 06 2022 13:24:45 GMT+0800 (台北標準時間)",
  likeCount: 1,
  likes: [
    {
      id: "62c944a5607936e5a39b0cc9",
      username: "jimmy",
      createdAt: "2022-07-09T09:04:37.183Z",
    },
  ],
  comments: [
    {
      id: "62c5424406a4fde2ea892097",
      body: "This is test comment",
      createdAt: "2022-07-06T08:05:24.978Z",
      username: "jimmy",
    },
  ],
  commentCount: 2,
};

describe("post crud", () => {
  it("get posts", async () => {
    const postsMock = {
      request: {
        query: FETCH_POSTS,
      },
      result: {
        data: {
          getPosts: [mockPost],
        },
      },
    };
    const {
      result: {
        data: { getPosts },
      },
    } = postsMock;
    const { body, username, likeCount, commentCount, createdAt } = getPosts[0];

    renderWithProviders(
      <MockedProvider mocks={[postsMock]} addTypename={false}>
        <Home />
      </MockedProvider>,
      {
        preloadedState: {
          auth: {
            user: null,
          },
        },
      }
    );
    expect(await screen.findByText("Loading Posts...")).toBeInTheDocument();
    expect(await screen.findByText(body)).toBeInTheDocument();
    expect(await screen.findByText(username)).toBeInTheDocument();
    expect(await screen.findByText(likeCount)).toBeInTheDocument();
    expect(await screen.findByText(commentCount)).toBeInTheDocument();
    expect(
      await screen.findByText(moment(createdAt).fromNow(true))
    ).toBeInTheDocument();
  });

  it("create post", async () => {
    const postsMock = {
      request: {
        query: CREATE_POST,
        variables: {
          body: "This is test post",
        },
      },
      result: {
        data: {
          createPost: mockPost,
        },
      },
    };

    render(
      <MockedProvider mocks={[postsMock]} addTypename={false}>
        <PostForm />
      </MockedProvider>
    );
    const bodyInput = await screen.findByRole("textbox");
    const button = await screen.findByRole("button");
    userEvent.type(bodyInput, "This is test post");
    userEvent.click(button);
    expect(await screen.findByText("Loading...")).toBeInTheDocument();
    expect(await screen.findByText("Post created!")).toBeInTheDocument();
  });

  it("delete post", async () => {
    const deleteMock = {
      request: {
        query: DELETE_POST,
        variables: {
          postId: mockPost.id,
        },
      },
      result: {
        data: {
          deletePost: "Post deleted!",
        },
      },
    };

    const cache = new InMemoryCache();
    cache.writeQuery({
      query: FETCH_POSTS,
      data: {
        getPosts: [mockPost],
      },
    });

    renderWithProviders(
      <MockedProvider mocks={[deleteMock]} cache={cache} addTypename={false}>
        <DeleteButton postId={mockPost.id} />
      </MockedProvider>,
      {
        preloadedState: {
          auth: {
            user: mockUser,
          },
        },
      }
    );
    const button = await screen.findByTestId(`delete-button-${mockPost.id}`);
    userEvent.click(button);
    const confirmDeleteBtn = await screen.findByText('Delete Post');
    userEvent.click(confirmDeleteBtn);
    expect(await screen.findByText("Post deleted!")).toBeInTheDocument();
  });
});
