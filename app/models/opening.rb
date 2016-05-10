class Opening < ActiveRecord::Base

  def insertOpeningLine(tree, line)
    findPlaceForNewLine(tree, line, 0)
  end



  private
  def findPlaceForNewLine(tree, line, i)
    if tree[line[i]] == nil
      insertBranch(tree, line, i)
    else
      tree = tree[line[i]]
      i += 1
      findPlaceForNewLine(tree, line, i)
    end
  end

  def insertBranch(parentNode, line, i)
    if (line.length > i)
      parentNode << Tree::TreeNode.new(line[i], ''git staturs)
      parentNode = parentNode[line[i]]
      i += 1
      insertBranch(parentNode, line, i)
    end
  end
end
