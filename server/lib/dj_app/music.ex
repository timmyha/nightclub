defmodule DjApp.Music do
  @doc """
  Mocks a SoundCloud search response.
  """
  def search_tracks(_query) do
    [
      %{
        id: 1,
        title: "Around the World",
        artist: "Daft Punk",
        artwork_url: "https://placekitten.com/200/200", # Mock art
        duration: 238000,
        permalink_url: "https://soundcloud.com/daft-punk/around-the-world",
        stream_url: "https://api.soundcloud.com/tracks/1/stream"
      },
      %{
        id: 2,
        title: "Windowlicker",
        artist: "Aphex Twin",
        artwork_url: "https://placekitten.com/201/201",
        duration: 367000,
        permalink_url: "https://soundcloud.com/richarddjames/windowlicker",
        stream_url: "https://api.soundcloud.com/tracks/2/stream"
      }
    ]
  end
end
