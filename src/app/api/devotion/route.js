
import { NextResponse } from 'next/server'

import * as cheerio from 'cheerio'

function daysBetween(date1, date2) {
  const d1 = new Date(Date.UTC(date1.getFullYear(), date1.getMonth(), date1.getDate()))
  const d2 = new Date(Date.UTC(date2.getFullYear(), date2.getMonth(), date2.getDate()))

  const diffTime = Math.abs(d2.getTime() - d1.getTime())
  
  return Math.floor(diffTime / (1000 * 60 * 60 * 24))
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url)
    const dateParam = searchParams.get('date') // format: yyyy-mm-dd

    if (!dateParam) {
      return NextResponse.json({ error: 'Missing date query param' }, { status: 400 })
    }

    const requestedDate = new Date(dateParam)
    const now = new Date()

    if (isNaN(requestedDate.getTime())) {
      return NextResponse.json({ error: 'Invalid date format' }, { status: 400 })
    }

    const dayDiff = daysBetween(now, requestedDate)
    const page = Math.floor(dayDiff / 18) + 1
    const articleIndex = dayDiff % 18

    console.log(page)

    // Fetch devotion list page
    const listRes = await fetch(`https://www.intouch.org/read/daily-devotions/all?page=${page}`, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      },
    })

    if (!listRes.ok) {
      throw new Error('Failed to fetch devotion list')
    }

    const listHtml = await listRes.text()

    console.log("listHtml", listHtml);

    const $ = cheerio.load(listHtml)

    const cardDates = $('div.search-page .card--date')

    console.log("cardDates", cardDates);

    const card = cardDates.eq(articleIndex).closest('.search-page__card')
    const href = card.find('a').attr('href')

    if (!href) {
      return NextResponse.json({ error: 'Devotion link not found' }, { status: 404 })
    }

    const link = `https://www.intouch.org${href}`

    // Fetch devotion detail page
    const detailRes = await fetch(link, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36',
      },
    })

    if (!detailRes.ok) {
      throw new Error('Failed to fetch devotion detail')
    }

    const detailHtml = await detailRes.text()
    const $$ = cheerio.load(detailHtml)

    const title = $$('.article__title').text().trim()
    const date = $$('.article__publish-date').text().trim()
    const content = []

    $$('.article__body p').each((_, el) => {
      const text = $$(el).text().trim()

      if (text) content.push(text)
    })

    return NextResponse.json({
      title,
      date,
      content: content.join('\n\n'),
      link,
    })
  } catch (error) {
    console.error('Scraping error:', error)

    return NextResponse.json({ error: 'Failed to scrape daily devotion' }, { status: 500 })
  }
}
