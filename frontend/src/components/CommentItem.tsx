import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Comment } from '../types';
import { COLORS } from '../theme/colors';

interface CommentItemProps {
  comment: Comment;
}

const CommentItem: React.FC<CommentItemProps> = ({ comment }) => {
  // Format the timestamp
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.username}>{comment.user.name}</Text>
        <Text style={styles.date}>{formatDate(comment.createdAt)}</Text>
      </View>
      <Text style={styles.text}>{comment.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.secondary,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.secondary,
    paddingBottom: 6,
  },
  username: {
    fontWeight: 'bold',
    fontSize: 14,
    color: COLORS.primary,
  },
  date: {
    fontSize: 12,
    color: COLORS.textLight,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    color: COLORS.text,
    paddingTop: 4,
  },
});

export default CommentItem; 