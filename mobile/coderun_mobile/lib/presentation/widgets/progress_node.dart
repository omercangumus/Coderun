// Coderun Stitch Design System — Learning Path Node
// Used in the Learning Path screen for lesson nodes

import 'package:flutter/material.dart';
import '../../core/theme/app_colors.dart';
import '../../core/theme/app_spacing.dart';

enum NodeState {
  completed,
  active,
  locked,
  reviewDue,
  checkpoint,
  miniProject,
}

enum NodeType {
  lesson,
  quiz,
  review,
  checkpoint,
  miniProject,
}

class ProgressNode extends StatelessWidget {
  final NodeState state;
  final NodeType type;
  final String label;
  final VoidCallback? onTap;
  final bool isLeft; // alternating left/right layout

  const ProgressNode({
    super.key,
    required this.state,
    required this.label,
    this.type = NodeType.lesson,
    this.onTap,
    this.isLeft = true,
  });

  Color get _nodeColor {
    switch (state) {
      case NodeState.completed:
        return AppColors.nodeCompleted;
      case NodeState.active:
        return AppColors.nodeActive;
      case NodeState.locked:
        return AppColors.nodeLocked;
      case NodeState.reviewDue:
        return AppColors.nodeReviewDue;
      case NodeState.checkpoint:
        return AppColors.nodeCheckpoint;
      case NodeState.miniProject:
        return AppColors.nodeMiniProject;
    }
  }

  Color get _iconColor {
    switch (state) {
      case NodeState.locked:
        return AppColors.outline;
      default:
        return Colors.white;
    }
  }

  IconData get _icon {
    switch (type) {
      case NodeType.quiz:
        return Icons.quiz_outlined;
      case NodeType.review:
        return Icons.refresh_rounded;
      case NodeType.checkpoint:
        return Icons.flag_rounded;
      case NodeType.miniProject:
        return Icons.code_rounded;
      case NodeType.lesson:
        switch (state) {
          case NodeState.completed:
            return Icons.check_rounded;
          case NodeState.locked:
            return Icons.lock_outline_rounded;
          case NodeState.reviewDue:
            return Icons.replay_rounded;
          default:
            return Icons.play_arrow_rounded;
        }
    }
  }

  double get _nodeSize {
    switch (type) {
      case NodeType.checkpoint:
      case NodeType.miniProject:
        return 64;
      default:
        return state == NodeState.active ? 60 : 52;
    }
  }

  @override
  Widget build(BuildContext context) {
    final nodeSize = _nodeSize;
    final isActive = state == NodeState.active;

    Widget nodeCircle = GestureDetector(
      onTap: state != NodeState.locked ? onTap : null,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        width: nodeSize,
        height: nodeSize,
        decoration: BoxDecoration(
          color: _nodeColor,
          shape: BoxShape.circle,
          border: isActive
              ? Border.all(
                  color: AppColors.primary.withOpacity(0.3),
                  width: 4,
                )
              : null,
          boxShadow: isActive
              ? [
                  BoxShadow(
                    color: AppColors.primary.withOpacity(0.35),
                    blurRadius: 16,
                    spreadRadius: 2,
                  ),
                ]
              : state == NodeState.completed
                  ? [
                      BoxShadow(
                        color: AppColors.nodeCompleted.withOpacity(0.3),
                        blurRadius: 8,
                        offset: const Offset(0, 2),
                      ),
                    ]
                  : null,
        ),
        child: Icon(
          _icon,
          color: _iconColor,
          size: nodeSize * 0.42,
        ),
      ),
    );

    // Label
    Widget labelWidget = Text(
      label,
      style: TextStyle(
        fontFamily: 'Lexend',
        fontSize: 12,
        fontWeight: isActive ? FontWeight.w600 : FontWeight.w400,
        color: isActive ? AppColors.primary : AppColors.onSurfaceVariant,
      ),
      textAlign: isLeft ? TextAlign.right : TextAlign.left,
      maxLines: 2,
      overflow: TextOverflow.ellipsis,
    );

    return Row(
      mainAxisAlignment:
          isLeft ? MainAxisAlignment.center : MainAxisAlignment.center,
      children: isLeft
          ? [
              SizedBox(
                width: 80,
                child: Align(
                  alignment: Alignment.centerRight,
                  child: labelWidget,
                ),
              ),
              const SizedBox(width: 12),
              nodeCircle,
              const SizedBox(width: 92),
            ]
          : [
              const SizedBox(width: 92),
              nodeCircle,
              const SizedBox(width: 12),
              SizedBox(
                width: 80,
                child: Align(
                  alignment: Alignment.centerLeft,
                  child: labelWidget,
                ),
              ),
            ],
    );
  }
}

/// Connector line between nodes
class NodeConnector extends StatelessWidget {
  final bool isCompleted;
  final double height;

  const NodeConnector({
    super.key,
    this.isCompleted = false,
    this.height = 40,
  });

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Container(
        width: 4,
        height: height,
        decoration: BoxDecoration(
          color: isCompleted
              ? AppColors.nodeCompleted
              : AppColors.outlineVariant,
          borderRadius: BorderRadius.circular(2),
        ),
      ),
    );
  }
}
