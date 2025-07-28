import React from 'react';
import FeedCard from '../feed/FeedCard';

interface MainFeedItemProps {
  note_id: number;
  user_id: number;
  problem_id: number;
  problem_name: string;
  tier: number;
  note_title: string;
  content: string;
  success_code: string;
  success_code_start: number;
  success_code_end: number;
  fail_code: string;
  fail_code_start: number;
  fail_code_end: number;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  view_count: number;
  like_count: number;
  comment_count: number;
  tags: string[];
  nickname: string;
  profile_image?: string;
  liked: boolean;
}