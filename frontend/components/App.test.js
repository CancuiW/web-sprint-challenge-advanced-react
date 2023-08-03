// Write your tests here
// ---Test that the visible texts in headings, buttons, links... render on the screen.
// ---Test that typing on the input results in its value changing to the entered text.
import React from "react";
import{render,screen,useEvent} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import AppFunctional from "./AppFunctional";

const up = screen.getByRole('#up')
const down = screen.getByRole('#down')
const left = screen.getByRole('#left')
const right = screen.getByRole('#right')
const reset = screen.getByRole('#reset')
const submit = screen.getByRole('#submit')

test('testing first render ', () => {
  render(<AppFunctional />)
})

test('Actions: up, right,display a correct coordination', async () => {
  render(<AppFunctional />)
  useEvent.click(up)
  useEvent.click(right)
  const message=await screen.findByText(/(3,1)/i)
  expect(message).toBeInTheDocument()
})

test('directly click submit button,display the error message', async () => {
  render(<AppFunctional />)
  useEvent.click(submit)
  const message = await screen.findByText(/Ouch: email is required/i)
  expect(message).toBeInTheDocument()
})

test('double click left button,display the error message', async () => {
  render(<AppFunctional />)
  useEvent.click(left)
  const message = await screen.findByText(/You can't go left/i)
  expect(message).toBeInTheDocument()
})
 

test('type valid email, click submit button,', async () => {
  render(<AppFunctional />)
  const inputValue="ww@wayne.edu"
  const inputDisplay=screen.getByTestId('email')
  useEvent.type(inputDisplay,inputValue)
  useEvent.click(submit)
  const message = await screen.findByText(/ww/i)
  expect(message).toBeInTheDocument()
})
