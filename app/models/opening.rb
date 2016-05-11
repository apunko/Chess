class Opening < ActiveRecord::Base

  def insert_opening_line(tree, line, messages)
    find_place_for_new_line(tree, line, messages, 0)
    tree
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
end

