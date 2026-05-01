defmodule DjApp.ClubsTest do
  use DjApp.DataCase

  alias DjApp.Clubs

  describe "rooms" do
    alias DjApp.Clubs.Room

    import DjApp.ClubsFixtures

    @invalid_attrs %{title: nil, slug: nil}

    test "list_rooms/0 returns all rooms" do
      room = room_fixture()
      assert Clubs.list_rooms() == [room]
    end

    test "get_room!/1 returns the room with given id" do
      room = room_fixture()
      assert Clubs.get_room!(room.id) == room
    end

    test "create_room/1 with valid data creates a room" do
      valid_attrs = %{title: "some title", slug: "some slug"}

      assert {:ok, %Room{} = room} = Clubs.create_room(valid_attrs)
      assert room.title == "some title"
      assert room.slug == "some slug"
    end

    test "create_room/1 with invalid data returns error changeset" do
      assert {:error, %Ecto.Changeset{}} = Clubs.create_room(@invalid_attrs)
    end

    test "update_room/2 with valid data updates the room" do
      room = room_fixture()
      update_attrs = %{title: "some updated title", slug: "some updated slug"}

      assert {:ok, %Room{} = room} = Clubs.update_room(room, update_attrs)
      assert room.title == "some updated title"
      assert room.slug == "some updated slug"
    end

    test "update_room/2 with invalid data returns error changeset" do
      room = room_fixture()
      assert {:error, %Ecto.Changeset{}} = Clubs.update_room(room, @invalid_attrs)
      assert room == Clubs.get_room!(room.id)
    end

    test "delete_room/1 deletes the room" do
      room = room_fixture()
      assert {:ok, %Room{}} = Clubs.delete_room(room)
      assert_raise Ecto.NoResultsError, fn -> Clubs.get_room!(room.id) end
    end

    test "change_room/1 returns a room changeset" do
      room = room_fixture()
      assert %Ecto.Changeset{} = Clubs.change_room(room)
    end
  end
end
