defmodule DjApp.BuildingConfig do
  @moduledoc """
  Defines the static structure of the venue.
  """

  @building %{
    "lobby" => %{
      name: "Neon Street",
      floor: 0,
      type: :lobby,
      excalibur_map: "maps/street.tmx"
    },
    "floor_1" => %{
      name: "The Bassment",
      floor: -1,
      type: :club,
      excalibur_map: "maps/bassment.tmx"
    }
  }

  def all_rooms, do: @building
  def get_room(id), do: Map.get(@building, id)
  def room_ids, do: Map.keys(@building)
end
