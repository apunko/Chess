class Opening < ActiveRecord::Base

  def insert_opening_line(tree, line)
    find_place_for_new_line(tree, line, 0)
    tree
  end

  private
  def find_place_for_new_line(tree, line, i)
    if !tree.is_child(line[i])
      insert_branch(tree, line, i)
    else
      tree = tree.find(line[i])
      i += 1
      find_place_for_new_line(tree, line, i)
    end
  end

  def insert_branch(parentNode, line, i)
    if (i < line.length)
      parentNode.insert(line[i], '')
      parentNode = parentNode.find(line[i])
      i += 1
      insert_branch(parentNode, line, i)
    end
  end
end

