defmodule DjAppWeb.SearchController do
  use DjAppWeb, :controller
  alias DjApp.Music

  def index(conn, %{"q" => query}) do
    tracks = Music.search_tracks(query)
    json(conn, tracks)
  end
end
