
'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

// Third-party Imports
import { EditorContent, useEditor } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'

// Utils Imports
import { toast } from '@/utils/toast'

// Styles
import '@/libs/styles/tiptapEditor.css'

const EditAdminFAQDrawer = ({ open, onClose, onSuccess, editData }) => {
  // States
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)

  // Editor setup
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write your FAQ content here...'
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Underline
    ],
    content: ''
  })

  // Update form when editData changes
  useEffect(() => {
    if (editData && open) {
      setTitle(editData.title || '')
      
      if (editor && editData.description) {
        editor.commands.setContent(editData.description)
      }
    }
  }, [editData, open, editor])

  // Handle form submission
  const handleSubmit = async () => {
    if (!title.trim()) {
      toast.error('Please enter a title')
      return
    }

    const description = editor?.getHTML() || ''
    if (!description.trim() || description === '<p></p>') {
      toast.error('Please enter a description')
      return
    }

    try {
      setLoading(true)

      const response = await fetch(`/api/admin/faq/${editData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title,
          description
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('FAQ updated successfully')
        onSuccess()
        onClose()
      } else {
        toast.error(data.error || 'Failed to update FAQ')
      }
    } catch (error) {
      console.error('Error updating FAQ:', error)
      toast.error('Failed to update FAQ')
    } finally {
      setLoading(false)
    }
  }

  // Handle close
  const handleClose = () => {
    setTitle('')
    editor?.commands.clearContent()
    onClose()
  }

  // Editor toolbar actions
  const addBold = () => editor?.chain().focus().toggleBold().run()
  const addItalic = () => editor?.chain().focus().toggleItalic().run()
  const addUnderline = () => editor?.chain().focus().toggleUnderline().run()
  const addStrike = () => editor?.chain().focus().toggleStrike().run()
  const addOrderedList = () => editor?.chain().focus().toggleOrderedList().run()
  const addBulletList = () => editor?.chain().focus().toggleBulletList().run()

  return (
    <Drawer
      open={open}
      anchor='right'
      variant='temporary'
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400, md: 500 } } }}
    >
      <div className='flex items-center justify-between pli-5 plb-4'>
        <Typography variant='h5'>Edit Admin FAQ</Typography>
        <IconButton size='small' onClick={handleClose}>
          <i className='ri-close-line text-2xl' />
        </IconButton>
      </div>
      <Divider />
      
      <div className='p-5 flex flex-col gap-5'>
        <TextField
          label='Title'
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <div>
          <Typography variant='body2' className='mb-2'>
            Description
          </Typography>
          
          {/* Editor Toolbar */}
          <Card variant='outlined' className='mb-2'>
            <CardContent className='p-2'>
              <div className='flex flex-wrap gap-1'>
                <IconButton size='small' onClick={addBold}>
                  <i className='ri-bold' />
                </IconButton>
                <IconButton size='small' onClick={addItalic}>
                  <i className='ri-italic' />
                </IconButton>
                <IconButton size='small' onClick={addUnderline}>
                  <i className='ri-underline' />
                </IconButton>
                <IconButton size='small' onClick={addStrike}>
                  <i className='ri-strikethrough' />
                </IconButton>
                <IconButton size='small' onClick={addOrderedList}>
                  <i className='ri-list-ordered' />
                </IconButton>
                <IconButton size='small' onClick={addBulletList}>
                  <i className='ri-list-unordered' />
                </IconButton>
              </div>
            </CardContent>
          </Card>

          {/* Editor */}
          <Card variant='outlined'>
            <CardContent className='min-h-[200px]'>
              <EditorContent editor={editor} className='outline-none' />
            </CardContent>
          </Card>
        </div>

        <div className='flex gap-4'>
          <Button
            variant='contained'
            onClick={handleSubmit}
            disabled={loading}
            className='flex-1'
          >
            {loading ? 'Updating...' : 'Update'}
          </Button>
          <Button
            variant='outlined'
            onClick={handleClose}
            disabled={loading}
            className='flex-1'
          >
            Cancel
          </Button>
        </div>
      </div>
    </Drawer>
  )
}

export default EditAdminFAQDrawer
