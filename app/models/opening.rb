class Opening < ActiveRecord::Base

  def insert_opening_line(tree, line, messages)
    find_place_for_new_line(tree, line, messages, 0)
    tree
  end

  def find_next_move(tree, history)
    next_move = ""
    message = ""
    instant_hash = tree.hash
    history.each do |full_move|
      instant_hash = instant_hash[full_move].hash
      if (!instant_hash)
        break
      end
    end
    if instant_hash
      next_move = instant_hash.keys[0]
      message = instant_hash[next_move].message
    end
    [next_move, message]
  end

  private
  def find_place_for_new_line(tree, line, messages, i)
    if !tree.is_child(line[i])
      insert_branch(tree, line, messages, i)
    else
      tree = tree.find(line[i])
      tree.message = messages[i]
      i += 1
      find_place_for_new_line(tree, line, messages, i)
    end
  end

  def insert_branch(parentNode, line, messages, i)
    if (i < line.length)
      parentNode.insert(line[i], messages[i])
      parentNode = parentNode.find(line[i])
      i += 1
      insert_branch(parentNode, line, messages, i)
    end
  end

  def find_last_node(history)

  end
end

