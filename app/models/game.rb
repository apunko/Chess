class Game < ActiveRecord::Base
  require 'json'
  belongs_to :user

  def self.get_init_state
    init_state = {
      a1: "wr", a2: "wp", b1: "wn", b2: "wp", c1: "wb", c2: "wp", d1: "wq", d2: "wp", e1: "wk", e2: "wp",
      f1: "wb", f2: "wp", g1: "wn", g2: "wp", h1: "wr", h2: "wp", a8: "br", a7: "bp", b8: "bn", b7: "bp",
      c8: "bb", c7: "bp", d8: "bq", d7: "bp", e8: "bk", e7: "bp", f8: "bb", f7: "bp", g8: "bn", g7: "bp",
      h8: "br", h7: "bp"
    }
    json_init_state = init_state.to_json
    json_init_state
  end
end
