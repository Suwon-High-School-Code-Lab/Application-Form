'use client'

import ReactMarkdown from 'react-markdown'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { useTheme } from 'next-themes'

interface MarkdownProps {
  children: string
  className?: string
}

export function Markdown({ children, className = '' }: MarkdownProps) {
  const { theme } = useTheme()

  return (
    <div className={`prose prose-base dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        components={{
        code({ node, inline, className, children, ...props }: any) {
          const match = /language-(\w+)/.exec(className || '')
          const language = match ? match[1] : ''

          return !inline && language ? (
            <SyntaxHighlighter
              style={theme === 'dark' ? oneDark : oneLight}
              language={language}
              PreTag="div"
              className="rounded-md !mt-2 !mb-2"
              {...props}
            >
              {String(children).replace(/\n$/, '')}
            </SyntaxHighlighter>
          ) : (
            <code className={className} {...props}>
              {children}
            </code>
          )
        },
      }}
      >
        {children}
      </ReactMarkdown>
    </div>
  )
}
