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
			<div class="home-content p-10">
				<header class="text-center mb-20">
					<h1 class="text-xlg text-bold mb-10">Créer un quiz</h1>
					<p class="text-sm">Partagez vos connaissances avec la communauté</p>
				</header>

				<section class="card card-shadow mt-20">
					<h2 class="text-lg text-bold mb-20">Informations générales</h2>
					<div class="flex flex-wrap gap-16">
						<div class="field">
							<label>Titre du quiz</label>
							<input
								class="w-full p-12 radius"
								type="text"
								[ngModel]="quizData().title"
								(ngModelChange)="updateQuizData('title', $event)"
								placeholder="Ex: Culture Générale"
							>
						</div>

						<div class="field">
							<label>Description du quiz</label>
							<textarea
								class="w-full p-12 radius"
								[ngModel]="quizData().description"
								(ngModelChange)="updateQuizData('description', $event)"
								rows="3"
								placeholder="Décrivez votre quiz..."
							></textarea>
						</div>

						<div class="field">
							<label>Catégorie</label>
							<select class="w-full p-12 radius" [ngModel]="quizData().category" (ngModelChange)="updateQuizData('category', $event)">
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

						<div class="field">
							<label>Difficulté</label>
							<select class="w-full p-12 radius" [ngModel]="quizData().difficulty" (ngModelChange)="updateQuizData('difficulty', $event)">
								<option value="">Sélectionner la difficulté</option>
								<option value="facile">Facile</option>
								<option value="moyen">Moyen</option>
								<option value="difficile">Difficile</option>
							</select>
						</div>
					</div>
				</section>

				<section class="card card-shadow mt-20">
					<h2 class="text-lg text-bold mb-20">Questions</h2>
					<div class="flex flex-col gap-16">
						<div class="card card-white" *ngFor="let question of quizData().questions; let i = index">
							<div class="flex justify-content-between align-items-center mb-20">
								<h3 class="text-semibold">Question {{ i + 1 }}</h3>
								<button class="btn btn-danger btn-sm" (click)="removeQuestion(i)">
									Supprimer
								</button>
							</div>

							<div class="flex flex-wrap gap-16">
								<div class="field w-full">
									<label>Type de question</label>
									<select class="w-full p-12 radius" [ngModel]="question.type" (ngModelChange)="handleTypeChange(i, $event)">
										<option value="simple">Question simple</option>
										<option value="musique">Musique</option>
										<option value="photo">Photo</option>
										<option value="ordre">A remettre en ordre</option>
									</select>
								</div>

								<div class="field w-full">
									<label>Question</label>
									<input class="w-full p-12 radius" type="text" [ngModel]="question.text" (ngModelChange)="updateQuestion(i, 'text', $event)" placeholder="Votre question...">
								</div>

								<div class="field w-full" *ngIf="question.type === 'musique'">
									<label>Fichier audio</label>
									<input type="file" accept="audio/*" (change)="onMediaSelected(i, $event)">
									<audio *ngIf="question.mediaUrl" [src]="question.mediaUrl" controls></audio>
								</div>

								<div class="field w-full" *ngIf="question.type === 'photo'">
									<label>Image</label>
									<input type="file" accept="image/*" (change)="onMediaSelected(i, $event)">
									<img *ngIf="question.mediaUrl" [src]="question.mediaUrl" alt="Aperçu de l'image de la question" class="w-full" style="max-width: 200px; height: auto;">
								</div>

								<div class="field w-full" *ngIf="question.type === 'ordre'">
									<label>Éléments à remettre en ordre</label>
									<textarea class="w-full p-12 radius" [ngModel]="question.orderItems.join('\n')" (ngModelChange)="onOrderItemsChange(i, $event)" rows="4" placeholder="Une ligne par élément à remettre en ordre"></textarea>
								</div>

								<div class="w-full" *ngIf="question.type !== 'ordre'">
									<label>Réponses possibles</label>
									<div class="flex flex-col gap-12">
										<div class="flex align-items-center gap-12" *ngFor="let answer of question.answers; let j = index">
											<input class="flex-1 p-12 radius" type="text" [ngModel]="answer.text" (ngModelChange)="updateAnswer(i, j, 'text', $event)" placeholder="Réponse...">
											<label class="flex align-items-center gap-8">
												<input type="radio" [name]="'correct-' + i" [checked]="answer.isCorrect" (change)="setCorrectAnswer(i, j)">
												<span class="text-sm">Bonne réponse</span>
											</label>
										</div>
									</div>
								</div>
							</div>
						</div>

						<div class="mt-20">
							<button class="btn btn-outline-primary" (click)="addQuestion()">Ajouter une question</button>
						</div>
					</div>
				</section>

				<section class="card card-shadow mt-20">
					<h2 class="text-lg text-bold mb-20">Paramètres</h2>
					<div class="flex flex-col gap-16">
						<div class="card card-white flex justify-content-between align-items-center">
							<div>
								<h3 class="text-semibold my-2">Quiz public</h3>
								<p class="text-sm">Rendre ce quiz visible par tous les utilisateurs</p>
							</div>
							<button
								class="flex align-items-center gap-8 p-8 radius"
								[class]="quizData().isPublic ? 'text-primary' : 'text-gray-700'"
								(click)="updateQuizData('isPublic', !quizData().isPublic)"
							>
								<i class="fas" [class]="quizData().isPublic ? 'fa-eye' : 'fa-eye-slash'"></i>
								<span class="text-sm">{{ quizData().isPublic ? 'Public' : 'Privé' }}</span>
							</button>
						</div>

						<div class="card card-white flex justify-content-between align-items-center">
							<div>
								<h3 class="text-semibold my-2">Autoriser les commentaires</h3>
								<p class="text-sm">Permettre aux utilisateurs de commenter ce quiz</p>
							</div>
							<button
								class="flex align-items-center gap-8 p-8 radius"
								[class]="quizData().allowComments ? 'text-primary' : 'text-gray-700'"
								(click)="updateQuizData('allowComments', !quizData().allowComments)"
							>
								<i class="fas" [class]="quizData().allowComments ? 'fa-comment' : 'fa-comment-slash'"></i>
								<span class="text-sm">{{ quizData().allowComments ? 'Activé' : 'Désactivé' }}</span>
							</button>
						</div>
					</div>
				</section>

				<section class="mt-20">
					<div class="flex gap-16 justify-content-center">
						<button class="btn btn-outline-primary py-12 px-24" (click)="saveDraft()">Sauvegarder brouillon</button>
						<button class="btn btn-primary py-12 px-24" (click)="publishQuiz()">Publier le quiz</button>
					</div>
				</section>
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
