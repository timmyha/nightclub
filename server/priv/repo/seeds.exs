alias DjApp.Clubs

# This checks if the room exists first so it doesn't crash on re-runs
case Clubs.get_room_by_slug("the-basement") do
  nil -> 
    Clubs.create_room(%{
      title: "The Neon Basement",
      slug: "the-basement"
    })
    IO.puts "Seed room created!"
  _room -> 
    IO.puts "Seed room already exists, skipping."
end
