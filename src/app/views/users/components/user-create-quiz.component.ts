import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserLayoutComponent } from '../shared/user-layout.component';

@Component({
	selector: 'app-usercreate-quiz',
	standalone: true,
	imports: [CommonModule, FormsModule, UserLayoutComponent],
	template: `
		<app-user-layout>
			<div>
				<header>
					<h1>Créer un quiz</h1>
					<p>Partagez vos connaissances avec la communauté</p>
				</header>

				<div>
					<div>
						<h2>Informations générales</h2>
						<div>
							<div>
								<input
									type="text"
									[ngModel]="quizData().title"
									(ngModelChange)="updateQuizData('title', $event)"
									placeholder="Ex: Culture Générale"
								>
							</div>

							<div>
								<textarea
									[ngModel]="quizData().description"
									(ngModelChange)="updateQuizData('description', $event)"
									rows="3"
									placeholder="Décrivez votre quiz..."
								></textarea>
							</div>

							<div>
								<select
									[ngModel]="quizData().category"
									(ngModelChange)="updateQuizData('category', $event)"
								>
									<option value="">Sélectionner une catégorie</option>
									<option value="culture-generale">Culture Générale</option>
									<option value="histoire">Histoire</option>
									<option value="geographie">Géographie</option>
									<option value="sciences">Sciences</option>
									<option value="litterature">Littérature</option>
									<option value="sport">Sport</option>
									<option value="cinema">Cinéma</option>
									<option value="musique">Musique</option>
								</select>
							</div>

							<div>
								<select
									[ngModel]="quizData().difficulty"
									(ngModelChange)="updateQuizData('difficulty', $event)"
								>
									<option value="">Sélectionner la difficulté</option>
									<option value="facile">Facile</option>
									<option value="moyen">Moyen</option>
									<option value="difficile">Difficile</option>
								</select>
							</div>
						</div>
					</div>

					<div>
						<h2>Questions</h2>
						<div>
							<div *ngFor="let question of quizData().questions; let i = index">
								<div>
									<h3>Question {{ i + 1 }}</h3>
									<button (click)="removeQuestion(i)">Supprimer</button>
								</div>

								<div>
									<select [ngModel]="question.type" (ngModelChange)="handleTypeChange(i, $event)">
										<option value="simple">Question simple</option>
										<option value="musique">Musique</option>
										<option value="photo">Photo</option>
										<option value="ordre">A remettre en ordre</option>
									</select>
								</div>

								<div>
									<div>
										<input
											type="text"
											[ngModel]="question.text"
											(ngModelChange)="updateQuestion(i, 'text', $event)"
											placeholder="Votre question..."
										>
									</div>

									<!-- Musique -->
									<div *ngIf="question.type === 'musique'">
										<input type="file" accept="audio/*" (change)="onMediaSelected(i, $event)">
										<audio *ngIf="question.mediaUrl" [src]="question.mediaUrl" controls></audio>
									</div>

									<!-- Photo -->
									<div *ngIf="question.type === 'photo'">
										<input type="file" accept="image/*" (change)="onMediaSelected(i, $event)">
										<img *ngIf="question.mediaUrl" [src]="question.mediaUrl" alt="aperçu" style="max-width: 200px; height: auto;">
									</div>

									<!-- Ordre -->
									<div *ngIf="question.type === 'ordre'">
										<textarea [ngModel]="question.orderItems.join('\n')" (ngModelChange)="onOrderItemsChange(i, $event)" rows="4" placeholder="Une ligne par élément à remettre en ordre"></textarea>
									</div>

									<div *ngIf="question.type !== 'ordre'">
										<div *ngFor="let answer of question.answers; let j = index">
											<div>
												<input
													type="text"
													[ngModel]="answer.text"
													(ngModelChange)="updateAnswer(i, j, 'text', $event)"
													placeholder="Réponse..."
												>
												<input
													type="radio"
													[name]="'correct-' + i"
													[checked]="answer.isCorrect"
													(change)="setCorrectAnswer(i, j)"
												>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>

						<button (click)="addQuestion()">Ajouter une question</button>
					</div>

					<div>
						<h2>Paramètres</h2>
						<div>
							<div>
								<div>
									<h3>Quiz public</h3>
									<p>Rendre ce quiz visible par tous les utilisateurs</p>
								</div>
								<input type="checkbox" [ngModel]="quizData().isPublic" (ngModelChange)="updateQuizData('isPublic', $event)">
							</div>

							<div>
								<div>
									<h3>Autoriser les commentaires</h3>
									<p>Permettre aux utilisateurs de commenter ce quiz</p>
								</div>
								<input type="checkbox" [ngModel]="quizData().allowComments" (ngModelChange)="updateQuizData('allowComments', $event)">
							</div>
						</div>
					</div>

					<div>
						<button (click)="saveDraft()">Sauvegarder brouillon</button>
						<button (click)="publishQuiz()">Publier le quiz</button>
					</div>
				</div>
			</div>
		</app-user-layout>
	`,
})
export class UserCreateQuizComponent {
	quizData = signal({
		title: '',
		description: '',
		category: '',
		difficulty: '',
		isPublic: true,
		allowComments: true,
		questions: [
			{
				text: '',
				type: 'simple',
				mediaUrl: '',
				orderItems: [] as string[],
				answers: [
					{ text: '', isCorrect: false },
					{ text: '', isCorrect: false },
					{ text: '', isCorrect: false },
					{ text: '', isCorrect: false }
				]
			}
		]
	});

	updateQuizData(property: string, value: any) {
		this.quizData.update(current => ({
			...current,
			[property]: value
		}));
	}

	updateQuestion(questionIndex: number, property: string, value: any) {
		this.quizData.update(current => ({
			...current,
			questions: current.questions.map((q, i) =>
				i === questionIndex ? { ...q, [property]: value } : q
			)
		}));
	}

	updateAnswer(questionIndex: number, answerIndex: number, property: string, value: any) {
		this.quizData.update(current => ({
			...current,
			questions: current.questions.map((q, i) =>
				i === questionIndex ? {
					...q,
					answers: q.answers.map((a, j) =>
						j === answerIndex ? { ...a, [property]: value } : a
					)
				} : q
			)
		}));
	}

	setCorrectAnswer(questionIndex: number, answerIndex: number) {
		this.quizData.update(current => ({
			...current,
			questions: current.questions.map((q, i) =>
				i === questionIndex ? {
					...q,
					answers: q.answers.map((a, j) => ({
						...a,
						isCorrect: j === answerIndex
					}))
				} : q
			)
		}));
	}

	addQuestion() {
		this.quizData.update(current => ({
			...current,
			questions: [...current.questions, {
				text: '',
				type: 'simple',
				mediaUrl: '',
				orderItems: [] as string[],
				answers: [
					{ text: '', isCorrect: false },
					{ text: '', isCorrect: false },
					{ text: '', isCorrect: false },
					{ text: '', isCorrect: false }
				]
			}]
		}));
	}

	handleTypeChange(questionIndex: number, value: string) {
		this.updateQuestion(questionIndex, 'type', value);
		// Réinitialiser les champs spécifiques
		this.quizData.update(current => ({
			...current,
			questions: current.questions.map((q, i) =>
				i === questionIndex ? { ...q, mediaUrl: '', orderItems: [] } : q
			)
		}));
	}

	onMediaSelected(questionIndex: number, event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files && input.files[0];
		if (!file) return;
		const url = URL.createObjectURL(file);
		this.updateQuestion(questionIndex, 'mediaUrl', url);
	}

	onOrderItemsChange(questionIndex: number, value: string) {
		const items = value.split('\n').map(v => v.trim()).filter(v => v.length > 0);
		this.updateQuestion(questionIndex, 'orderItems', items);
	}

	removeQuestion(questionIndex: number) {
		if (this.quizData().questions.length > 1) {
			this.quizData.update(current => ({
				...current,
				questions: current.questions.filter((_, i) => i !== questionIndex)
			}));
		}
	}

	saveDraft() {
		console.log('Brouillon sauvegardé:', this.quizData());
		alert('Brouillon sauvegardé avec succès !');
	}

	publishQuiz() {
		console.log('Quiz publié:', this.quizData());
		alert('Quiz publié avec succès !');
	}
}
