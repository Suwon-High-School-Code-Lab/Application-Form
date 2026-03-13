export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type AnswerType = 'short_text' | 'long_text' | 'number' | 'multiple_choice' | 'checkbox' | 'file_upload'
export type SubmissionStatus = 'draft' | 'submitted'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          is_admin: boolean
          created_at: string
        }
        Insert: {
          id: string
          email: string
          is_admin?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          email?: string
          is_admin?: boolean
          created_at?: string
        }
      }
      form_questions: {
        Row: {
          id: string
          order: number
          title: string
          content: string | null
          answer_type: AnswerType
          options: Json | null
          required: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order: number
          title: string
          content?: string | null
          answer_type: AnswerType
          options?: Json | null
          required?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order?: number
          title?: string
          content?: string | null
          answer_type?: AnswerType
          options?: Json | null
          required?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      form_submissions: {
        Row: {
          id: string
          user_id: string
          answers: Json
          submitted_at: string
          status: SubmissionStatus
        }
        Insert: {
          id?: string
          user_id: string
          answers: Json
          submitted_at?: string
          status?: SubmissionStatus
        }
        Update: {
          id?: string
          user_id?: string
          answers?: Json
          submitted_at?: string
          status?: SubmissionStatus
        }
      }
    }
  }
}
