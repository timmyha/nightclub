defmodule DjApp.ClubsFixtures do
  @moduledoc """
  This module defines test helpers for creating
  entities via the `DjApp.Clubs` context.
  """

  @doc """
  Generate a unique room slug.
  """
  def unique_room_slug, do: "some slug#{System.unique_integer([:positive])}"

  @doc """
  Generate a room.
  """
  def room_fixture(attrs \\ %{}) do
    {:ok, room} =
      attrs
      |> Enum.into(%{
        slug: unique_room_slug(),
        title: "some title"
      })
      |> DjApp.Clubs.create_room()

    room
  end
end
