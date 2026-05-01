defmodule DjApp.AccountsFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `DjApp.Accounts` context.
  """

  @doc """
  Generate a user.
  """
  def user_fixture(attrs \\ %{}) do
    {:ok, user} =
      attrs
      |> Enum.into(%{
        avatar_url: "some avatar_url",
        name: "some name"
      })
      |> DjApp.Accounts.create_user()

    user
  end
end
