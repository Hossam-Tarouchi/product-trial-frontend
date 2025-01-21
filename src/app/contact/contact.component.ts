import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ToastModule } from 'primeng/toast';


@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ButtonModule, ToastModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup;

  constructor(private fb: FormBuilder, private messageService: MessageService) { }

  ngOnInit(): void {
    // Initialize form with validation rules
    this.contactForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],  // Email is required and must be a valid email
      message: ['', [Validators.required, Validators.maxLength(300)]]  // Message is required and should be <= 300 characters
    });
  }

  // Method to handle form submission
  onSubmit(): void {
    if (this.contactForm.valid) {
      // Simulate successful form submission
      this.messageService.add({ severity: 'success', summary: 'Succès', detail: 'Demande de contact envoyée avec succès.' });

      // Reset the form after submission
      this.contactForm.reset();
    } else {
      // Show error message if form is invalid
      this.messageService.add({ severity: 'error', summary: 'Erreur', detail: 'Veuillez remplir tous les champs correctement.' });
    }
  }

  // Getter for form controls
  get email() {
    return this.contactForm.get('email');
  }

  get message() {
    return this.contactForm.get('message');
  }
}
