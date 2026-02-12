import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import ReplyModal from './ReplyModal'

describe('ReplyModal', () => {
  const mockOnClose = vi.fn()
  const mockOnSend = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly when open', () => {
    render(
      <ReplyModal isOpen={true} onClose={mockOnClose} onSend={mockOnSend} />
    )
    
    expect(screen.getByText('Reply with Love')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Write your heart out...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /send reply/i })).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', () => {
    render(
      <ReplyModal isOpen={true} onClose={mockOnClose} onSend={mockOnSend} />
    )
    
    fireEvent.click(screen.getByLabelText('Close reply modal'))
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('submits the message and shows success state', async () => {
    mockOnSend.mockResolvedValueOnce(undefined)
    
    render(
      <ReplyModal isOpen={true} onClose={mockOnClose} onSend={mockOnSend} />
    )
    
    const textarea = screen.getByPlaceholderText('Write your heart out...')
    fireEvent.change(textarea, { target: { value: 'Hello Valentine!' } })
    
    const sendButton = screen.getByRole('button', { name: /send reply/i })
    fireEvent.click(sendButton)
    
    expect(mockOnSend).toHaveBeenCalledWith('Hello Valentine!')
    
    await waitFor(() => {
      expect(screen.getByText(/message sent successfully/i)).toBeInTheDocument()
    })
  })

  it('shows error message when sending fails', async () => {
    mockOnSend.mockRejectedValueOnce(new Error('Failed'))
    
    render(
      <ReplyModal isOpen={true} onClose={mockOnClose} onSend={mockOnSend} />
    )
    
    const textarea = screen.getByPlaceholderText('Write your heart out...')
    fireEvent.change(textarea, { target: { value: 'Hello Valentine!' } })
    
    fireEvent.click(screen.getByRole('button', { name: /send reply/i }))
    
    await waitFor(() => {
      expect(screen.getByText(/failed to send message/i)).toBeInTheDocument()
    })
  })

  it('disables button when message is empty', () => {
    render(
      <ReplyModal isOpen={true} onClose={mockOnClose} onSend={mockOnSend} />
    )
    
    const sendButton = screen.getByRole('button', { name: /send reply/i })
    expect(sendButton).toBeDisabled()
  })
})
