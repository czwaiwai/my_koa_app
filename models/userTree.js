const { DataTypes } = require("sequelize");

// 定义节点类型枚举
const NODE_TYPES = {
  GROUP: "集团",
  SHAREHOLDER: "股东",
  DEALER: "经销商",
  PLAYER: "玩家",
};
module.exports = (sequelize) => {
  // 使用 sequelize.define 定义模型
  const TreeNode = sequelize.define(
    "TreeNode",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "节点名称",
      },
      type: {
        type: DataTypes.ENUM(Object.values(NODE_TYPES)),
        allowNull: false,
        comment: "节点类型",
      },
      parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: "TreeNodes",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        comment: "父节点ID（邻接表模型）",
      },
      path: {
        type: DataTypes.STRING(1024),
        allowNull: false,
        defaultValue: "/",
        comment: "节点路径（路径枚举模型），格式：/父节点ID/当前节点ID/",
      },
      depth: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        comment: "节点深度（从0开始）",
      },
      username: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "用户名称",
      },
    },
    {
      tableName: "tree_nodes",
      timestamps: true,
      paranoid: true,
      indexes: [
        {
          fields: ["parentId"],
        },
        {
          fields: ["path"],
        },
        {
          fields: ["type"],
        },
      ],
    }
  );

  // 定义关联关系
  TreeNode.associate = function (models) {
    TreeNode.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    TreeNode.belongsTo(TreeNode, { as: "parent", foreignKey: "parentId" });
    TreeNode.hasMany(TreeNode, { as: "children", foreignKey: "parentId" });
  };

  // 添加实例方法：添加子节点
  TreeNode.prototype.addChild = async function (childData) {
    const sequelize = this.sequelize;

    return sequelize.transaction(async (t) => {
      // 创建子节点
      const childNode = await TreeNode.create(
        {
          ...childData,
          parentId: this.id,
          depth: this.depth + 1,
          path: `${this.path}${this.id}/`,
        },
        { transaction: t }
      );

      // 更新子节点路径（添加自身ID）
      await childNode.update(
        {
          path: `${childNode.path}${childNode.id}/`,
        },
        { transaction: t }
      );

      return childNode;
    });
  };

  // 添加类方法：获取某个节点的所有子节点（包括间接子节点）
  TreeNode.getSubtree = async function (nodeId) {
    const node = await this.findByPk(nodeId);
    if (!node) {
      throw new Error(`节点ID ${nodeId} 不存在`);
    }

    return this.findAll({
      where: {
        path: {
          [DataTypes.Op.like]: `${node.path}${node.id}/%`,
        },
      },
      order: [["path", "ASC"]],
    });
  };

  // 添加实例方法：获取节点的完整路径节点列表
  TreeNode.prototype.getPathNodes = async function () {
    // 解析路径中的节点ID
    const pathIds = this.path
      .split("/")
      .filter((segment) => segment !== "")
      .map(Number);

    return TreeNode.findAll({
      where: {
        id: {
          [DataTypes.Op.in]: pathIds,
        },
      },
      order: [["depth", "ASC"]],
    });
  };

  // 添加实例方法：移动节点到新父节点
  TreeNode.prototype.moveTo = async function (newParentId) {
    const sequelize = this.sequelize;

    return sequelize.transaction(async (t) => {
      // 获取新父节点
      const newParent = await TreeNode.findByPk(newParentId, {
        transaction: t,
      });
      if (!newParent) {
        throw new Error(`新父节点ID ${newParentId} 不存在`);
      }

      // 计算新路径
      const newPath = `${newParent.path}${newParent.id}/`;
      const oldPath = `${this.path}${this.id}/`;

      // 更新当前节点
      await this.update(
        {
          parentId: newParentId,
          depth: newParent.depth + 1,
          path: newPath,
        },
        { transaction: t }
      );

      // 更新所有子节点的路径
      const subNodes = await TreeNode.findAll({
        where: {
          path: {
            [DataTypes.Op.like]: `${oldPath}%`,
          },
        },
        transaction: t,
      });

      for (const subNode of subNodes) {
        // 计算子节点的新路径
        const relativePath = subNode.path.substring(oldPath.length);
        const newSubNodePath = `${newPath}${this.id}/${relativePath}`;

        await subNode.update(
          {
            path: newSubNodePath,
            depth:
              newPath.split("/").length -
              2 +
              relativePath.split("/").length -
              2,
          },
          { transaction: t }
        );
      }

      return this;
    });
  };

  return TreeNode;
};
