class OpeningNode
  attr_accessor :move, :message
  def initialize(move, message)
    @move = move
    @message = message
    @hash = {}
  end

  def is_child(move)
    @hash[move] ? true : false
  end

  def insert(move, message)
    @hash[move] = OpeningNode.new(move, message)
  end

  def insert_node(node)
    @hash[node.move] = node
  end

  def find(move)
    @hash[move]
  end

  def self.from_json(string)
    hash = JSON.parse(string)
    root = OpeningNode.new('', '');
    if (hash['hash'].length > 0)
      self.parse_hash(root, hash['hash'])
    end
    root
  end

  def self.parse_hash(root, hash)
    hash.each do |key, value|
      new_root = OpeningNode.new(key, value['message'])
      root.insert_node(parse_hash(new_root, value['hash']))
    end
    root
  end
end