import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from '../hooks/useTheme';
import { PlantType, ZombieType, PLANTS_CONFIG, ZOMBIES_CONFIG, plantImages, zombieImages } from '../data/gameData';
import { StoryCharacter, characterColors, characterNames } from '../data/storyData';
import { cn, clamp } from '../lib/utils';
import * as d3 from 'd3';

// 定义关系类型
export type RelationType = 'family' | 'master' | 'enemy' | 'alliance' | 'subordinate' | 'custom';

// 定义关系样式配置
export interface RelationStyle {
  lineType: string;
  color: string;
  width: number;
  dashArray?: string;
}

// 定义关系样式映射
export const RELATION_STYLES: Record<RelationType, RelationStyle> = {
  family: {
    lineType: 'solid',
    color: '#E74C3C',
    width: 3
  },
  master: {
    lineType: 'dashed',
    color: '#3498DB',
    width: 2,
    dashArray: '5,5'
  },
  enemy: {
    lineType: 'solid',
    color: '#9B59B6',
    width: 3,
    dashArray: '1,0' // 模拟双实线效果
  },
  alliance: {
    lineType: 'dotted',
    color: '#2ECC71',
    width: 2,
    dashArray: '2,2'
  },
  subordinate: {
    lineType: 'solid',
    color: '#F39C12',
    width: 2
  },
  custom: {
    lineType: 'solid',
    color: '#95A5A6',
    width: 2
  }
};

// 定义角色节点数据结构
export interface CharacterNode {
  id: string;
  name: string;
  avatar: string;
  type: 'plant' | 'zombie';
  faction: string;
  title?: string;
  position: {
    x: number;
    y: number;
  };
  attributes: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// 定义关系边数据结构
export interface RelationEdge {
  id: string;
  source: string;
  target: string;
  type: RelationType;
  label: string;
  strength: number;
  direction: 'bidirectional' | 'unidirectional';
  attributes: Record<string, any>;
  style: RelationStyle;
  createdAt: string;
  updatedAt: string;
}

// 定义关系图方案数据结构
export interface RelationshipScheme {
  id: string;
  name: string;
  description: string;
  nodes: CharacterNode[];
  edges: RelationEdge[];
  createdAt: string;
  updatedAt: string;
}

const CharacterRelationships: React.FC = () => {
  const { theme } = useTheme();
  const navigate = useNavigate();
  const params = useParams();
  const graphContainerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>('default');
  const [currentScheme, setCurrentScheme] = useState<RelationshipScheme | null>(null);
  const [availableCharacters, setAvailableCharacters] = useState<CharacterNode[]>([]);
  const [selectedCharacters, setSelectedCharacters] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredCharacters, setFilteredCharacters] = useState<CharacterNode[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const [isCreatingEdge, setIsCreatingEdge] = useState<boolean>(false);
  const [sourceNodeId, setSourceNodeId] = useState<string | null>(null);
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [viewTransform, setViewTransform] = useState({ x: 0, y: 0, k: 1 });
  const [isDraggingView, setIsDraggingView] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [isEditPanelOpen, setIsEditPanelOpen] = useState<boolean>(true);
  const [savedSchemes, setSavedSchemes] = useState<RelationshipScheme[]>([]);
  const [showSchemeSaveDialog, setShowSchemeSaveDialog] = useState<boolean>(false);
  const [newSchemeName, setNewSchemeName] = useState<string>('');
  const [newSchemeDescription, setNewSchemeDescription] = useState<string>('');
  const [isExportDialogOpen, setIsExportDialogOpen] = useState<boolean>(false);
  const [exportFormat, setExportFormat] = useState<'json' | 'image'>('json');
  // 新增：用于存储自定义关系标签的状态
  const [customRelationLabel, setCustomRelationLabel] = useState<string>('');
  
  // 从游戏数据中加载角色
  useEffect(() => {
    const loadCharacters = () => {
      const characters: CharacterNode[] = [];
      
      // 加载植物角色
      Object.entries(PLANTS_CONFIG).forEach(([key, plant]) => {
        // 确保植物数据存在
        if (!plant) return;
        
        // 获取植物的世界观分类
        let faction = '未知';
        if (plant.name.includes("徐清岚") && !plant.name.includes("（神）") && !plant.name.includes("（梦）") || 
            plant.name === "屹九" || 
            plant.name.includes("Vexithra") ||
            plant.name === "羽尘") {
          faction = "人类世界";
        } else if (plant.name === "清鸢" || plant.name === "善•猫教主" || plant.name === "青玄" || plant.name === "奈奈生" || plant.name === "晓月") {
          faction = "光明大陆";
        } else if (plant.name === "慕容言风" || plant.name === "沐沐") {
          faction = "暗影大陆";
        } else if (plant.name === "冥界三使" || plant.name === "筱燊傀") {
          faction = "冥界";
        } else if (plant.name === "凌" || plant.name === "星褶") {
          faction = "洪荒";
        } else if (plant.name === "云璃•时光裁决者") {
          faction = "命运神殿";
        }
        
        characters.push({
          id: `plant_${key}`,
          name: plant.name,
          avatar: plantImages[key as PlantType],
          type: 'plant',
          faction,
          title: plant.category,
          position: {
            x: Math.random() * 800,
            y: Math.random() * 600
          },
          attributes: {
            health: plant.health,
            damage: plant.damage,
            cost: plant.cost,
            rarity: plant.rarity
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      });
      
      // 加载僵尸角色
      Object.entries(ZOMBIES_CONFIG).forEach(([key, zombie]) => {
        // 确保僵尸数据存在
        if (!zombie) return;
        
        // 获取僵尸的世界观分类
        let faction = '未知';
        if (key === "xuqinglan_dark" || key === "vexithra" || key === "xian") {
          faction = "人类世界";
        } else if (key === "su_huai" || key === "cat_leader" || key === "ji_zai" || 
                   key === "li_huo" || key === "xia" || key === "alibi" || key === "qiuyue") {
          faction = "暗影大陆";
        } else if (key === "shantao") {
          faction = "时空城";
        }
        
        characters.push({
          id: `zombie_${key}`,
          name: zombie.name,
          avatar: zombieImages[key as ZombieType],
          type: 'zombie',
          faction,
          title: zombie.difficulty,
          position: {
            x: Math.random() * 800,
            y: Math.random() * 600
          },
          attributes: {
            health: zombie.health,
            damage: zombie.damage,
            speed: zombie.speed,
            armor: zombie.armor
          },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      });
      
      setAvailableCharacters(characters);
      setFilteredCharacters(characters);
      
      // 初始化默认方案
      initDefaultScheme(characters);
    };
    
    loadCharacters();
    loadSavedSchemes();
    
    // 定期自动保存
    const autoSaveInterval = setInterval(() => {
      if (currentScheme) {
        saveCurrentScheme();
      }
    }, 30000);
    
    return () => clearInterval(autoSaveInterval);
  }, []);
  
  // 初始化默认方案
  const initDefaultScheme = (characters: CharacterNode[]) => {
    // 从本地存储加载默认方案，如果不存在则创建一个
    const savedDefaultScheme = localStorage.getItem('characterRelationship_default');
    if (savedDefaultScheme) {
      try {
        const scheme = JSON.parse(savedDefaultScheme) as RelationshipScheme;
        setCurrentScheme(scheme);
        setSelectedCharacters(scheme.nodes.map(node => node.id));
        return;
      } catch (error) {
        console.error('Failed to load default scheme:', error);
      }
    }
    
    // 创建默认方案，包含一些主要角色
    const mainCharacters = characters.filter(char => 
      char.name === '清鸢' || 
      char.name === '宿槐' || 
      char.name === '徐清岚（魔法少女）' ||
      char.name === '善•猫教主' ||
      char.name === '青玄'
    );
    
    // 重新定位主要角色，使它们分布更合理
    const positionedCharacters = mainCharacters.map((char, index) => {
      const angle = (index / mainCharacters.length) * 2 * Math.PI;
      const radius = 200;
      const centerX = 400;
      const centerY = 300;
      
      return {
        ...char,
        position: {
          x: centerX + radius * Math.cos(angle),
          y: centerY + radius * Math.sin(angle)
        }
      };
    });
    
    // 创建一些默认关系
    const defaultEdges: RelationEdge[] = [];
    
    // 查找清鸢和宿槐
    const qingyuan = positionedCharacters.find(char => char.name === '清鸢');
    const suhuai = positionedCharacters.find(char => char.name === '宿槐');
    const xuqinglan = positionedCharacters.find(char => char.name === '徐清岚（魔法少女）');
    const shancat = positionedCharacters.find(char => char.name === '善•猫教主');
    
    if (qingyuan && suhuai) {
      defaultEdges.push({
        id: `relation_${Date.now()}_1`,
        source: qingyuan.id,
        target: suhuai.id,
        type: 'enemy',
        label: '敌对',
        strength: 0.9,
        direction: 'bidirectional',
        attributes: {
          event: '光暗之战'
        },
        style: RELATION_STYLES.enemy,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    if (qingyuan && xuqinglan) {
      defaultEdges.push({
        id: `relation_${Date.now()}_2`,
        source: qingyuan.id,
        target: xuqinglan.id,
        type: 'alliance',
        label: '同盟',
        strength: 0.8,
        direction: 'bidirectional',
        attributes: {
          event: '共同对抗暗影'
        },
        style: RELATION_STYLES.alliance,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    if (qingyuan && shancat) {
      defaultEdges.push({
        id: `relation_${Date.now()}_3`,
        source: qingyuan.id,
        target: shancat.id,
        type: 'master',
        label: '救赎',
        strength: 0.7,
        direction: 'unidirectional',
        attributes: {
          event: '净化黑暗'
        },
        style: RELATION_STYLES.master,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    
    const defaultScheme: RelationshipScheme = {
      id: 'default',
      name: '默认关系图',
      description: '主要角色的关系网络',
      nodes: positionedCharacters,
      edges: defaultEdges,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setCurrentScheme(defaultScheme);
    setSelectedCharacters(positionedCharacters.map(char => char.id));
    localStorage.setItem('characterRelationship_default', JSON.stringify(defaultScheme));
  };
  
  // 加载已保存的方案
  const loadSavedSchemes = () => {
    try {
      const saved = localStorage.getItem('characterRelationship_schemes');
      if (saved) {
        const schemes = JSON.parse(saved) as RelationshipScheme[];
        setSavedSchemes(schemes);
      }
    } catch (error) {
      console.error('Failed to load saved schemes:', error);
    }
  };
  
  // 保存当前方案
  const saveCurrentScheme = useCallback(() => {
    if (!currentScheme) return;
    
    try {
      if (currentScheme.id === 'default') {
        localStorage.setItem('characterRelationship_default', JSON.stringify(currentScheme));
      } else {
        const schemes = [...savedSchemes];
        const index = schemes.findIndex(scheme => scheme.id === currentScheme.id);
        if (index >= 0) {
          schemes[index] = currentScheme;
        } else {
          schemes.push(currentScheme);
        }
        setSavedSchemes(schemes);
        localStorage.setItem('characterRelationship_schemes', JSON.stringify(schemes));
      }
    } catch (error) {
      console.error('Failed to save current scheme:', error);
    }
  }, [currentScheme, savedSchemes]);
  
  // 搜索和筛选角色
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCharacters(availableCharacters);
    } else {
      const filtered = availableCharacters.filter(char => 
        char.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        char.faction.toLowerCase().includes(searchTerm.toLowerCase()) ||
        char.title?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCharacters(filtered);
    }
  }, [searchTerm, availableCharacters]);
  
  // 初始化和更新D3图表
  useEffect(() => {
    if (!svgRef.current || !currentScheme) return;
    
    const svg = d3.select(svgRef.current);
    const g = svg.select<SVGGElement>('g');
    
    // 清除现有内容
    g.selectAll('*').remove();
    
    // 更新变换
    g.attr('transform', `translate(${viewTransform.x},${viewTransform.y}) scale(${viewTransform.k})`);
    
    // 创建力导向图模拟
    const simulation = d3.forceSimulation(currentScheme.nodes)
      .force('link', d3.forceLink(currentScheme.edges).id((d: any) => d.id).distance(150))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(400, 300));
    
    // 创建连线
    const links = g.append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(currentScheme.edges)
      .join('line')
      .attr('stroke-width', d => d.style.width)
      .attr('stroke', d => d.style.color)
      .style('stroke-dasharray', d => d.style.dashArray || 'none')
      .style('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        setSelectedEdge(d.id);
        setSelectedNode(null);
      })
      .on('mouseover', function(event, d) {
        d3.select(this).attr('stroke-width', d.style.width * 1.5).style('stroke-opacity', 0.9);
        
        // 显示提示框
        const tooltip = d3.select('body')
          .append('div')
          .attr('class', 'fixed z-50 bg-gray-800 text-white p-2 rounded shadow-lg text-sm')
          .style('left', `${event.pageX + 10}px`)
          .style('top', `${event.pageY - 10}px`)
          .style('opacity', 0)
          .transition()
          .duration(200)
          .style('opacity', 1);
        
        tooltip.html(`<strong>${d.label}</strong><br/>强度: ${d.strength * 100}%`);
        
        // 存储tooltip引用，以便在mouseout时移除
        (this as any).tooltip = tooltip;
      })
      .on('mouseout', function() {
        d3.select(this).attr('stroke-width', d => d.style.width).style('stroke-opacity', 0.6);
        
        // 移除提示框
        if ((this as any).tooltip) {
          (this as any).tooltip.transition().duration(200).style('opacity', 0).remove();
        }
      });
    
    // 创建节点组
    const nodeGroups = g.append('g')
      .selectAll('g')
      .data(currentScheme.nodes)
      .join('g')
      .attr('transform', d => `translate(${d.position.x},${d.position.y})`)
      .call(d3.drag<SVGGElement, CharacterNode>()
        .on('start', (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.position.x;
          d.fy = d.position.y;
          setDraggedNode(d.id);
          setSelectedNode(d.id);
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
          // 更新节点位置
          updateNodePosition(d.id, event.x, event.y);
        })
        .on('end', (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
          setDraggedNode(null);
          // 如果正在创建关系，并且有起始节点
          if (isCreatingEdge && sourceNodeId && sourceNodeId !== d.id) {
            createRelation(sourceNodeId, d.id);
            setIsCreatingEdge(false);
            setSourceNodeId(null);
          }
        })
      )
      .on('click', (event, d) => {
        event.stopPropagation();
        if (isCreatingEdge) {
          if (sourceNodeId === d.id) {
            // 取消创建关系
            setIsCreatingEdge(false);
            setSourceNodeId(null);
          } else {
            // 创建关系
            createRelation(sourceNodeId!, d.id);
            setIsCreatingEdge(false);
            setSourceNodeId(null);
          }
        } else {
          setSelectedNode(d.id);
          setSelectedEdge(null);
        }
      });
    
    // 添加节点背景圆
    nodeGroups.append('circle')
      .attr('r', 35)
      .attr('fill', d => d.type === 'plant' ? '#228B22' : '#8B0000')
      .attr('stroke', d => d.id === selectedNode ? '#FFD700' : '#fff')
      .attr('stroke-width', d => d.id === selectedNode ? 3 : 2)
      .style('cursor', 'pointer');
    
    // 添加节点头像
    nodeGroups.append('image')
      .attr('xlink:href', d => d.avatar)
      .attr('x', -25)
      .attr('y', -25)
      .attr('width', 50)
      .attr('height', 50)
      .attr('clip-path', 'circle(25px at center)')
      .style('cursor', 'pointer');
    
    // 添加节点名称
    nodeGroups.append('text')
      .text(d => d.name)
      .attr('x', 0)
      .attr('y', 55)
      .attr('text-anchor', 'middle')
      .attr('fill', '#fff')
      .attr('font-size', 12)
      .attr('font-weight', 'bold')
      .style('pointer-events', 'none');
    
    // 添加节点派系
    nodeGroups.append('text')
      .text(d => d.faction)
      .attr('x', 0)
      .attr('y', 70)
      .attr('text-anchor', 'middle')
      .attr('fill', '#ccc')
      .attr('font-size', 10)
      .style('pointer-events', 'none');
    
    // 更新节点和连线位置
    simulation.on('tick', () => {
      links
        .attr('x1', d => {
          const sourceNode = currentScheme?.nodes.find(node => node.id === d.source);
          return sourceNode?.position.x || 0;
        })
        .attr('y1', d => {
          const sourceNode = currentScheme?.nodes.find(node => node.id === d.source);
          return sourceNode?.position.y || 0;
        })
        .attr('x2', d => {
          const targetNode = currentScheme?.nodes.find(node => node.id === d.target);
          return targetNode?.position.x || 0;
        })
        .attr('y2', d => {
          const targetNode = currentScheme?.nodes.find(node => node.id === d.target);
          return targetNode?.position.y || 0;
        });
      
      nodeGroups.attr('transform', d => `translate(${d.position.x},${d.position.y})`);
    });
    
    // 清理函数
    return () => {
      simulation.stop();
    };
  }, [currentScheme, viewTransform, isCreatingEdge, sourceNodeId, selectedNode, selectedEdge, draggedNode]);
  
  // 更新节点位置
  const updateNodePosition = useCallback((nodeId: string, x: number, y: number) => {
    if (!currentScheme) return;
    
    const updatedNodes = currentScheme.nodes.map(node => 
      node.id === nodeId ? { ...node, position: { x, y }, updatedAt: new Date().toISOString() } : node
    );
    
    setCurrentScheme(prev => prev ? { ...prev, nodes: updatedNodes, updatedAt: new Date().toISOString() } : null);
  }, [currentScheme]);
  
  // 添加角色到关系图
  const addCharacterToGraph = useCallback((characterId: string) => {
    if (!currentScheme) return;
    
    // 检查角色是否已经在图中
    if (currentScheme.nodes.some(node => node.id === characterId)) return;
    
    // 查找角色数据
    const character = availableCharacters.find(char => char.id === characterId);
    if (!character) return;
    
    // 创建新节点
    const newNode = {
      ...character,
      position: {
        x: 400 + (Math.random() - 0.5) * 200,
        y: 300 + (Math.random() - 0.5) * 200
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setCurrentScheme(prev => prev ? {
      ...prev,
      nodes: [...prev.nodes, newNode],
      updatedAt: new Date().toISOString()
    } : null);
    
    setSelectedCharacters(prev => [...prev, characterId]);
  }, [currentScheme, availableCharacters]);
  
  // 从关系图中移除角色
  const removeCharacterFromGraph = useCallback((characterId: string) => {
    if (!currentScheme) return;
    
    // 移除节点和相关的边
    const updatedNodes = currentScheme.nodes.filter(node => node.id !== characterId);
    const updatedEdges = currentScheme.edges.filter(
      edge => edge.source !== characterId && edge.target !== characterId
    );
    
    setCurrentScheme(prev => prev ? {
      ...prev,
      nodes: updatedNodes,
      edges: updatedEdges,
      updatedAt: new Date().toISOString()
    } : null);
    
    setSelectedCharacters(prev => prev.filter(id => id !== characterId));
    
    // 如果移除的是当前选中的节点，清除选择
    if (selectedNode === characterId) {
      setSelectedNode(null);
    }
  }, [currentScheme, selectedNode]);
  
  // 创建关系
  const createRelation = useCallback((sourceId: string, targetId: string) => {
    if (!currentScheme) return;
    
    // 创建新关系
    const newRelation: RelationEdge = {
      id: `relation_${Date.now()}`,
      source: sourceId,
      target: targetId,
      type: 'alliance',
      label: '同盟',
      strength: 0.7,
      direction: 'bidirectional',
      attributes: {},
      style: RELATION_STYLES.alliance,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setCurrentScheme(prev => prev ? {
      ...prev,
      edges: [...prev.edges, newRelation],
      updatedAt: new Date().toISOString()
    } : null);
    
    // 选中新创建的关系
    setSelectedEdge(newRelation.id);
    setSelectedNode(null);
  }, [currentScheme]);
  
  // 删除关系
  const deleteRelation = useCallback((relationId: string) => {
    if (!currentScheme) return;
    
    const updatedEdges = currentScheme.edges.filter(edge => edge.id !== relationId);
    
    setCurrentScheme(prev => prev ? {
      ...prev,
      edges: updatedEdges,
      updatedAt: new Date().toISOString()
    } : null);
    
    // 清除选中状态
    setSelectedEdge(null);
  }, [currentScheme]);
  
  // 开始创建关系
  const startCreateRelation = useCallback((nodeId: string) => {
    setIsCreatingEdge(true);
    setSourceNodeId(nodeId);
    setSelectedNode(nodeId);
  }, []);
  
  // 取消创建关系
  const cancelCreateRelation = useCallback(() => {
    setIsCreatingEdge(false);
    setSourceNodeId(null);
  }, []);
  
  // 更新关系属性
  const updateRelation = useCallback((relationId: string, updates: Partial<RelationEdge>) => {
    if (!currentScheme) return;
    
    const updatedEdges = currentScheme.edges.map(edge => 
      edge.id === relationId ? { 
        ...edge, 
        ...updates, 
        updatedAt: new Date().toISOString(),
        // 如果更新了关系类型，也要更新样式
        style: updates.type ? RELATION_STYLES[updates.type] : edge.style
      } : edge
    );
    
    setCurrentScheme(prev => prev ? {
      ...prev,
      edges: updatedEdges,
      updatedAt: new Date().toISOString()
    } : null);
  }, [currentScheme]);
  
  // 缩放视图
  const handleWheel = useCallback((event: React.WheelEvent) => {
    event.preventDefault();
    const scaleFactor = event.deltaY > 0 ? 0.9 : 1.1;
    setViewTransform(prev => {
      const newK = clamp(prev.k * scaleFactor, 0.5, 2);
      // 以鼠标位置为中心缩放
      const rect = svgRef.current?.getBoundingClientRect();
      if (!rect) return { ...prev, k: newK };
      
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
      
      return {
        x: mouseX - (mouseX - prev.x) * (newK / prev.k),
        y: mouseY - (mouseY - prev.y) * (newK / prev.k),
        k: newK
      };
    });
  }, []);
  
  // 开始拖动视图
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (event.button !== 1 && !event.ctrlKey) return; // 只有中键或Ctrl+左键才能拖动
    setIsDraggingView(true);
    setDragStartPos({ x: event.clientX, y: event.clientY });
  }, []);
  
  // 拖动视图
  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (!isDraggingView) return;
    
    const dx = event.clientX - dragStartPos.x;
    const dy = event.clientY - dragStartPos.y;
    
    setViewTransform(prev => ({
      ...prev,
      x: prev.x + dx,
      y: prev.y + dy
    }));
    
    setDragStartPos({ x: event.clientX, y: event.clientY });
  }, [isDraggingView, dragStartPos]);
  
  // 结束拖动视图
  const handleMouseUp = useCallback(() => {
    setIsDraggingView(false);
  }, []);
  
  // 重置视图
  const resetView = useCallback(() => {
    setViewTransform({ x: 0, y: 0, k: 1 });
  }, []);
  
  // 保存新方案
  const saveNewScheme = useCallback(() => {
    if (!currentScheme || !newSchemeName.trim()) return;
    
    const newScheme: RelationshipScheme = {
      ...currentScheme,
      id: `scheme_${Date.now()}`,
      name: newSchemeName.trim(),
      description: newSchemeDescription.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    try {
      const schemes = [...savedSchemes, newScheme];
      setSavedSchemes(schemes);
      localStorage.setItem('characterRelationship_schemes', JSON.stringify(schemes));
      setCurrentScheme(newScheme);
      setSelectedSchemeId(newScheme.id);
      setShowSchemeSaveDialog(false);
      setNewSchemeName('');
      setNewSchemeDescription('');
    } catch (error) {
      console.error('Failed to save new scheme:', error);
    }
  }, [currentScheme, newSchemeName, newSchemeDescription, savedSchemes]);
  
  // 加载方案
  const loadScheme = useCallback((schemeId: string) => {
    if (schemeId === 'default') {
      const savedDefaultScheme = localStorage.getItem('characterRelationship_default');
      if (savedDefaultScheme) {
        try {
          const scheme = JSON.parse(savedDefaultScheme) as RelationshipScheme;
          setCurrentScheme(scheme);
          setSelectedCharacters(scheme.nodes.map(node => node.id));
          setSelectedSchemeId(schemeId);
        } catch (error) {
          console.error('Failed to load default scheme:', error);
        }
      }
    } else {
      const scheme = savedSchemes.find(s => s.id === schemeId);
      if (scheme) {
        setCurrentScheme(scheme);
        setSelectedCharacters(scheme.nodes.map(node => node.id));
        setSelectedSchemeId(schemeId);
      }
    }
  }, [savedSchemes]);
  
  // 删除方案
  const deleteScheme = useCallback((schemeId: string) => {
    if (window.confirm('确定要删除这个方案吗？此操作不可撤销。')) {
      try {
        const schemes = savedSchemes.filter(s => s.id !== schemeId);
        setSavedSchemes(schemes);
        localStorage.setItem('characterRelationship_schemes', JSON.stringify(schemes));
        
        // 如果删除的是当前方案，切换到默认方案
        if (selectedSchemeId === schemeId) {
          loadScheme('default');
        }
      } catch (error) {
        console.error('Failed to delete scheme:', error);
      }
    }
  }, [savedSchemes, selectedSchemeId, loadScheme]);
  
  // 导出方案
  const exportScheme = useCallback(() => {
    if (!currentScheme) return;
    
    if (exportFormat === 'json') {
      const dataStr = JSON.stringify(currentScheme, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = `${currentScheme.name.replace(/\s+/g, '_')}_relationship_map.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    } else if (exportFormat === 'image') {
      // 这里简化处理，实际项目中可能需要使用html2canvas或类似库
      alert('图像导出功能尚未完全实现');
    }
    
    setIsExportDialogOpen(false);
  }, [currentScheme, exportFormat]);
  
  // 导入方案
  const importScheme = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const scheme = JSON.parse(content) as RelationshipScheme;
        
        // 验证数据结构
        if (scheme.nodes && Array.isArray(scheme.nodes) && scheme.edges && Array.isArray(scheme.edges)) {
          const newScheme: RelationshipScheme = {
            ...scheme,
            id: `scheme_${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          const schemes = [...savedSchemes, newScheme];
          setSavedSchemes(schemes);
          localStorage.setItem('characterRelationship_schemes', JSON.stringify(schemes));
          setCurrentScheme(newScheme);
          setSelectedSchemeId(newScheme.id);
          alert('方案导入成功！');
        } else {
          throw new Error('无效的方案文件格式');
        }
      } catch (error) {
        console.error('Failed to import scheme:', error);
        alert('导入失败：' + error.message);
      }
    };
    reader.readAsText(file);
    
    // 重置input，以便可以重复选择同一个文件
    event.target.value = '';
  }, [savedSchemes]);
  
  // 清空关系图
  const clearGraph = useCallback(() => {
    if (window.confirm('确定要清空当前关系图吗？此操作不可撤销。')) {
      setCurrentScheme(prev => prev ? {
        ...prev,
        nodes: [],
        edges: [],
        updatedAt: new Date().toISOString()
      } : null);
      setSelectedCharacters([]);
      setSelectedNode(null);
      setSelectedEdge(null);
    }
  }, []);
  
  // 渲染选中节点的详情
  const renderSelectedNodeDetails = () => {
    if (!selectedNode || !currentScheme) return null;
    
    const node = currentScheme.nodes.find(n => n.id === selectedNode);
    if (!node) return null;
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center">
          <i className={`fa-solid ${node.type === 'plant' ? 'fa-seedling text-green-400' : 'fa-skull text-red-400'} mr-2`}></i>
          角色详情
        </h3>
        
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white">
            <img src={node.avatar} alt={node.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-white">{node.name}</h4>
            <p className="text-gray-400">{node.faction} · {node.title}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          {Object.entries(node.attributes).map(([key, value]) => (
            <div key={key} className="bg-gray-800 p-2 rounded-lg">
              <div className="text-xs text-gray-400">{key}</div>
              <div className="font-bold text-white">{value}</div>
            </div>
          ))}
        </div>
        
        <button
          onClick={() => startCreateRelation(node.id)}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          <i className="fa-solid fa-link mr-2"></i> 创建关系
        </button>
        
        <button
          onClick={() => removeCharacterFromGraph(node.id)}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          <i className="fa-solid fa-trash-alt mr-2"></i> 从关系图中移除
        </button>
      </div>
    );
  };
  
  // 渲染选中关系的详情
  const renderSelectedEdgeDetails = () => {
    if (!selectedEdge || !currentScheme) return null;
    
    const edge = currentScheme.edges.find(e => e.id === selectedEdge);
    if (!edge) return null;
    
    const sourceNode = currentScheme.nodes.find(n => n.id === edge.source);
    const targetNode = currentScheme.nodes.find(n => n.id === edge.target);
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white flex items-center">
          <i className="fa-solid fa-arrows-between-lines text-purple-400 mr-2"></i>
          关系详情
        </h3>
        
        <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white mb-1">
              <img src={sourceNode?.avatar} alt={sourceNode?.name} className="w-full h-full object-cover" />
            </div>
            <span className="text-xs text-white">{sourceNode?.name}</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div 
              className="w-16 h-1 bg-current mb-1" 
              style={{ 
                backgroundColor: edge.style.color,
                width: '32px',
                height: `${edge.style.width}px`,
                borderStyle: edge.style.lineType === 'solid' ? 'solid' : 'dashed',
                borderWidth: edge.style.width,
                borderColor: edge.style.color,
                borderDasharray: edge.style.dashArray
              }}
            />
            <span className="text-xs text-purple-400">{edge.label}</span>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white mb-1">
              <img src={targetNode?.avatar} alt={targetNode?.name} className="w-full h-full object-cover" />
            </div>
            <span className="text-xs text-white">{targetNode?.name}</span>
          </div>
        </div>
        
         <div className="space-y-3">
          <div>
            <label className="block text-xs text-gray-400 mb-1">关系类型</label>
            <select
              value={edge.type}
              onChange={(e) => {
                const newType = e.target.value as RelationType;
                // 如果选择自定义类型，使用当前的customRelationLabel值
                const newLabel = newType === 'custom' && customRelationLabel
                  ? customRelationLabel 
                  : getRelationLabel(newType);
                updateRelation(edge.id, { type: newType, label: newLabel });
              }}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-2"
            >
              <option value="family">亲属关系</option>
              <option value="master">师徒关系</option>
              <option value="enemy">敌对关系</option>
              <option value="alliance">同盟关系</option>
              <option value="subordinate">从属关系</option>
              <option value="custom">自定义</option>
            </select>
          </div>
          
          {/* 新增：当选择自定义关系类型时显示输入框 */}
          {edge.type === 'custom' && (
            <div>
              <label className="block text-xs text-gray-400 mb-1">自定义关系名称</label>
              <input
                type="text"
                value={customRelationLabel || edge.label}
                onChange={(e) => {
                  setCustomRelationLabel(e.target.value);
                  // 实时更新关系标签
                  updateRelation(edge.id, { label: e.target.value });
                }}
                placeholder="输入自定义关系名称"
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-2"
              />
            </div>
          )}
          
          <div>
            <label className="block text-xs text-gray-400 mb-1">关系强度</label>
            <div className="flex items-center">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={edge.strength}
                onChange={(e) => updateRelation(edge.id, { strength: parseFloat(e.target.value) })}
                className="w-full accent-purple-500"
              />
              <span className="ml-2 text-sm text-white">{Math.round(edge.strength * 100)}%</span>
            </div>
          </div>
          
          <div>
            <label className="block text-xs text-gray-400 mb-1">关系方向</label>
            <select
              value={edge.direction}
              onChange={(e) => updateRelation(edge.id, { direction: e.target.value as 'bidirectional' | 'unidirectional' })}
              className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg p-2"
            >
              <option value="bidirectional">双向</option>
              <option value="unidirectional">单向</option>
            </select>
          </div>
        </div>
        
        <button
          onClick={() => deleteRelation(edge.id)}
          className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center"
        >
          <i className="fa-solid fa-trash-alt mr-2"></i> 删除关系
        </button>
      </div>
    );
  };
  
  // 获取关系类型对应的标签
  const getRelationLabel = (type: RelationType): string => {
    switch (type) {
      case 'family': return '亲属';
      case 'master': return '师徒';
      case 'enemy': return '敌对';
      case 'alliance': return '同盟';
      case 'subordinate': return '从属';
      default: return '自定义';
    }
  };
  
  // 获取当前选中的角色
  const getSelectedCharacter = () => {
    if (!currentScheme) return null;
    return currentScheme.nodes.find(node => node.id === selectedNode);
  };
  
  // 键盘快捷键处理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && (selectedNode || selectedEdge)) {
        e.preventDefault();
        if (selectedNode) {
          removeCharacterFromGraph(selectedNode);
        } else if (selectedEdge) {
          deleteRelation(selectedEdge);
        }
      } else if (e.ctrlKey && e.key === 'a') {
        e.preventDefault();
        // 全选功能可以在这里实现
      } else if (e.ctrlKey && e.key === 'z') {
        e.preventDefault();
        // 撤销功能可以在这里实现
      } else if (e.ctrlKey && e.key === 'y') {
        e.preventDefault();
        // 重做功能可以在这里实现
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedNode, selectedEdge, removeCharacterFromGraph, deleteRelation]);
  
  // 拖拽处理（从左侧列表拖拽到关系图）
  const handleDragStart = (e: React.DragEvent, characterId: string) => {
    e.dataTransfer.setData('characterId', characterId);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const characterId = e.dataTransfer.getData('characterId');
    if (characterId) {
      addCharacterToGraph(characterId);
    }
  };
  
  return (
    <div className={`min-h-screen ${theme === 'light' ? 'bg-gray-100' : 'bg-gray-900'} text-gray-900 dark:text-white transition-colors duration-300 p-4 relative overflow-hidden`}>
      {/* 背景动态光效 */}
      <div className="fixed top-0 left-0 right-0 bottom-0 pointer-events-none z-0">
        <motion.div 
          className="absolute top-1/4 right-1/4 w-1/3 h-1/3 bg-purple-500/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, -20, 0],
            y: [0, -20, 0]
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-1/4 left-1/4 w-1/3 h-1/3 bg-blue-500/5 rounded-full blur-3xl"
          animate={{ 
            scale: [1, 1.2, 1],
            x: [0, 20, 0],
            y: [0, 20, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
      </div>
      
      {/* 页面头部 */}
      <header className="max-w-7xl mx-auto mb-6 relative z-10">
        <div className="absolute top-0 left-0 z-20">
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-gray-800/80 dark:bg-gray-900/80 backdrop-blur-sm p-3 rounded-full border border-gray-700 text-white hover:bg-gray-700 transition-all duration-300 shadow-lg flex items-center justify-center"
            onClick={() => navigate(-1)}
            aria-label="返回上一页"
          >
            <i className="fa-solid fa-arrow-left text-xl"></i>
          </motion.button>
        </div>
        
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row items-center justify-between pt-12 pb-4"
        >
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              人物关系
            </h1>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
              探索角色之间的关系网络，创建和管理自定义关系图
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => resetView()}
              className="bg-gray-800 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
            >
              <i className="fa-solid fa-arrows-rotate mr-2"></i> 重置视图
            </button>
            
            <button
              onClick={() => setShowSchemeSaveDialog(true)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
            >
              <i className="fa-solid fa-save mr-2"></i> 保存方案
            </button>
            
            <button
              onClick={() => setIsExportDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
            >
              <i className="fa-solid fa-download mr-2"></i> 导出
            </button>
            
            <label className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center cursor-pointer">
              <i className="fa-solid fa-upload mr-2"></i> 导入
              <input
                type="file"
                accept=".json"
                onChange={importScheme}
                className="hidden"
              />
            </label>
          </div>
        </motion.div>
      </header>
      
      {/* 方案选择器 */}
      <div className="max-w-7xl mx-auto mb-6 relative z-10">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-gray-400 whitespace-nowrap">当前方案：</span>
          <select
            value={selectedSchemeId}
            onChange={(e) => loadScheme(e.target.value)}
            className="bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="default">默认关系图</option>
            {savedSchemes.map(scheme => (
              <option key={scheme.id} value={scheme.id}>{scheme.name}</option>
            ))}
          </select>
          
          {selectedSchemeId !== 'default' && (
            <button
              onClick={() => deleteScheme(selectedSchemeId)}
              className="text-red-400 hover:text-red-300 transition-colors duration-200"
            >
              <i className="fa-solid fa-trash-alt"></i>
            </button>
          )}
          
          <div className="ml-auto">
            <button
              onClick={clearGraph}
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center"
            >
              <i className="fa-solid fa-eraser mr-2"></i> 清空关系图
            </button>
          </div>
        </div>
      </div>
      
      {/* 主要内容区域 */}
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* 左侧角色列表 */}
          <div className="lg:col-span-3 bg-gray-800/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700 h-[calc(100vh-240px)] overflow-hidden flex flex-col">
            <div className="mb-4">
              <h2 className="text-lg font-bold text-white mb-3 flex items-center">
                <i className="fa-solid fa-users text-purple-400 mr-2"></i>
                角色列表
              </h2>
              <div className="relative">
                <input
                  type="text"
                  placeholder="搜索角色..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 bg-gray-900 border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <i className="fa-solid fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2">
              <div className="space-y-2">
                {filteredCharacters.map(char => (
                  <motion.div
                    key={char.id}
                    className={`p-3 rounded-lg border transition-all duration-200 ${
                      selectedCharacters.includes(char.id)
                        ? 'bg-gray-700 border-purple-500'
                        : 'bg-gray-900 border-gray-700 hover:bg-gray-800'
                    } cursor-move`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, char.id)}
                    whileHover={{ x: 5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <img src={char.avatar} alt={char.name} className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{char.name}</h3>
                          <p className="text-xs text-gray-400">{char.faction}</p>
                        </div>
                      </div>
                      {!selectedCharacters.includes(char.id) && (
                        <button
                          onClick={() => addCharacterToGraph(char.id)}
                          className="text-purple-400 hover:text-purple-300 transition-colors duration-200"
                        >
                          <i className="fa-solid fa-plus-circle"></i>
                        </button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          
          {/* 中央关系图谱 */}
          <div className="lg:col-span-6 relative">
            <div 
              ref={graphContainerRef}
              className="bg-gray-800/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl border border-gray-700 h-[calc(100vh-240px)] overflow-hidden"
              onWheel={handleWheel}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              {/* D3.js 关系图容器 */}
              <svg
                ref={svgRef}
                className="w-full h-full"
                viewBox="0 0 800 600"
                style={{ cursor: isDraggingView ? 'grabbing' : 'grab' }}
              >
                <g>
                  {/* D3.js 将在这里渲染节点和连线 */}
                </g>
              </svg>
              
              {/* 关系创建提示 */}
              {isCreatingEdge && sourceNodeId && (
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-purple-900/80 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm z-10">
                  <i className="fa-solid fa-arrow-right-to-bracket mr-1"></i>
                  点击目标角色创建关系，或按ESC取消
                </div>
              )}
              
              {/* 空状态提示 */}
              {!currentScheme || currentScheme.nodes.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                  <i className="fa-solid fa-users-slash text-5xl mb-4"></i>
                  <p className="text-xl font-medium">暂无角色</p>
                  <p className="text-sm mt-2">从左侧列表拖拽角色到这里开始创建关系图</p>
                </div>
              )}
              
              {/* 操作提示 */}
              <div className="absolute bottom-4 right-4 bg-gray-900/80 text-white px-4 py-2 rounded-lg text-sm backdrop-blur-sm z-10">
                <div className="space-y-1">
                  <div className="flex items-center">
                    <i className="fa-solid fa-mouse-pointer mr-2 text-purple-400"></i>
                    <span>点击选择</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fa-solid fa-hand mr-2 text-purple-400"></i>
                    <span>拖动移动节点</span>
                  </div>
                  <div className="flex items-center">
                    <i className="fa-solid fa-mouse mr-2 text-purple-400"></i>
                    <span>滚轮缩放</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 右侧编辑面板 */}
          <div className={`lg:col-span-3 ${isEditPanelOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-gray-800/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700 h-[calc(100vh-240px)] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-white flex items-center">
                  <i className="fa-solid fa-sliders text-purple-400 mr-2"></i>
                  编辑面板
                </h2>
                <button
                  onClick={() => setIsEditPanelOpen(!isEditPanelOpen)}
                  className="lg:hidden text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <i className="fa-solid fa-times"></i>
                </button>
              </div>
              
              {selectedNode ? renderSelectedNodeDetails() : 
               selectedEdge ? renderSelectedEdgeDetails() : (
                <div className="text-center py-8 text-gray-400">
                  <i className="fa-solid fa-hand-pointer text-4xl mb-4"></i>
                  <p>选择一个角色或关系来编辑</p>
                </div>
              )}
            </div>
          </div>
          
          {/* 移动端展开编辑面板按钮 */}
          {!isEditPanelOpen && (
            <button
              onClick={() => setIsEditPanelOpen(true)}
              className="lg:hidden fixed bottom-4 right-4 bg-purple-600 hover:bg-purple-700 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-30"
            >
              <i className="fa-solid fa-sliders"></i>
            </button>
          )}
        </div>
      </div>
      
      {/* 保存方案对话框 */}
      <AnimatePresence>
        {showSchemeSaveDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowSchemeSaveDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4">保存关系图方案</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">方案名称</label>
                  <input
                    type="text"
                    value={newSchemeName}
                    onChange={(e) => setNewSchemeName(e.target.value)}
                    placeholder="输入方案名称"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">方案描述（可选）</label>
                  <textarea
                    value={newSchemeDescription}
                    onChange={(e) => setNewSchemeDescription(e.target.value)}
                    placeholder="输入方案描述"
                    className="w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[80px]"
                  />
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowSchemeSaveDialog(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                >
                  取消
                </button>
                <button
                  onClick={saveNewScheme}
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-lg transition-colors duration-200"
                  disabled={!newSchemeName.trim()}
                >
                  保存
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 导出对话框 */}
      <AnimatePresence>
        {isExportDialogOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setIsExportDialogOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-800 rounded-xl p-6 border border-gray-700 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold text-white mb-4">导出关系图</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">导出格式</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="exportFormat"
                        value="json"
                        checked={exportFormat === 'json'}
                        onChange={() => setExportFormat('json')}
                        className="accent-purple-500"
                      />
                      <span className="text-white">JSON 文件</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="exportFormat"
                        value="image"
                        checked={exportFormat === 'image'}
                        onChange={() => setExportFormat('image')}
                        className="accent-purple-500"
                      />
                      <span className="text-white">图片（开发中）</span>
                    </label>
                  </div>
                </div>
                
                <div className="p-3 bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-300">
                    <i className="fa-solid fa-circle-info text-blue-400 mr-2"></i>
                    JSON 格式包含完整的关系图数据，可用于备份或在其他设备上导入
                  </p></div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setIsExportDialogOpen(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors duration-200"
                >
                  取消
                </button>
                <button
                  onClick={exportScheme}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                >
                  导出
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* 页脚 */}
      <footer className="max-w-7xl mx-auto mt-8 text-center text-gray-500 text-sm relative z-10">
        <p>© 2025 植物与僵尸关系图谱 - 探索角色之间的复杂关系</p>
      </footer>
    </div>
  );
};

export default CharacterRelationships;