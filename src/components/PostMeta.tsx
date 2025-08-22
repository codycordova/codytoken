"use client";
import React from 'react';

type PostMetaProps = {
    date: string;
    readTime: string;
    className?: string;
};

export default function PostMeta({ date, readTime, className }: PostMetaProps) {
    const classes = `post-meta${className ? ' ' + className : ''}`;
    return (
        <div className={classes}>
            <span>{date}</span>
            <span> • {readTime}</span>
        </div>
    );
}


