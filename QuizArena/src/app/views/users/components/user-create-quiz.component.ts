import { Component, signal, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../../services/user.service';
import { SeoService } from '../../../services/seo.service';

@Component({
	selector: 'app-usercreate-quiz',
	standalone: true,
	imports: [CommonModule, FormsModule],
	template: `
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
								<option *ngFor="let cat of categories()" [value]="cat.id">{{ cat.name }}</option>
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
						<div class="card card-white" *ngFor="let question of quizData().questions; let i = index; trackBy: trackByIndex">
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
										<div class="flex align-items-center gap-12" *ngFor="let answer of question.answers; let j = index; trackBy: trackByIndex">
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
						<button class="btn btn-outline-primary py-12 px-24" (click)="saveDraft()" [disabled]="isLoading()">Sauvegarder brouillon</button>
						<button class="btn btn-primary py-12 px-24" (click)="publishQuiz()" [disabled]="isLoading()">
							<span *ngIf="isLoading()">Publication en cours...</span>
							<span *ngIf="!isLoading()">Publier le quiz</span>
						</button>
					</div>
				</section>
					</div>
	`,
})
export class UserCreateQuizComponent implements OnInit, OnDestroy {
	private seo = inject(SeoService);
	private http = inject(HttpClient);
	private userService = inject(UserService);
	private readonly api = 'http://localhost:3000';

	categories = signal<any[]>([]);
	isLoading = signal(false);

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

	trackByIndex = (_: number, item: any) => item?.id ?? _;

	ngOnInit(): void {
		this.loadCategories();
		this.seo.updateSEO({
			title: 'Créer un quiz - QuizArena',
			description: 'Créez et partagez vos propres quiz sur QuizArena. Ajoutez des questions, des médias et des réponses pour tester les connaissances de la communauté.',
			keywords: 'créer quiz, créer questionnaire, partager connaissances, quiz personnalisé, questions médias'
		});
	}

	private loadCategories() {
		this.http.get<any[]>(`${this.api}/category`).subscribe({
			next: (cats) => this.categories.set(cats),
			error: (e) => console.error('Erreur chargement catégories:', e)
		});
	}

	ngOnDestroy(): void {
		this.seo.resetToDefault();
	}

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
		const token = localStorage.getItem('auth_token');
		if (!token) { alert('Vous devez être connecté pour publier un quiz.'); return; }

		// Validation basique
		const q = this.quizData();
		if (!q.title.trim()) { alert('Le titre est requis'); return; }
		if (!q.description.trim()) { alert('La description est requise'); return; }
		if (!q.category) { alert('La catégorie est requise'); return; }
		if (!q.difficulty) { alert('La difficulté est requise'); return; }
		if (q.questions.length === 0) { alert('Au moins une question est requise'); return; }

		// Vérifier que chaque question a au moins une bonne réponse
		for (let i = 0; i < q.questions.length; i++) {
			const question = q.questions[i];
			if (!question.text.trim()) { alert(`Question ${i + 1}: le texte est requis`); return; }
			if (question.type !== 'ordre' && !question.answers.some(a => a.isCorrect && a.text.trim())) {
				alert(`Question ${i + 1}: au moins une bonne réponse est requise`); return;
			}
		}

		this.isLoading.set(true);
		const headers = { Authorization: `Bearer ${token}` } as any;
		const payload = this.mapToCreateQuizDto();

		// Créer le quiz d'abord
		this.http.post(`${this.api}/quiz`, payload, { headers }).subscribe({
			next: (quiz: any) => {
				// Puis créer les questions et réponses
				this.createQuestionsAndAnswers(quiz.id, headers);
			},
			error: (e) => {
				console.error('Erreur création quiz', e);
				alert('Erreur lors de la publication du quiz');
				this.isLoading.set(false);
			}
		});
	}

	private createQuestionsAndAnswers(quizId: string, headers: any) {
		const questions = this.quizData().questions;
		let completed = 0;
		let hasError = false;

		if (questions.length === 0) {
			this.finishQuizCreation();
			return;
		}

		questions.forEach((question, index) => {
			const questionPayload = {
				text: question.text,
				type: question.type.toUpperCase(),
				mediaUrl: question.mediaUrl || undefined,
				orderItems: question.type === 'ordre' ? question.orderItems : undefined,
				quizId: quizId,
				answers: question.type !== 'ordre' ? question.answers.filter(a => a.text.trim()) : []
			};

			this.http.post(`${this.api}/question`, questionPayload, { headers }).subscribe({
				next: () => {
					completed++;
					if (completed === questions.length && !hasError) {
						this.finishQuizCreation();
					}
				},
				error: (e) => {
					console.error(`Erreur création question ${index + 1}:`, e);
					hasError = true;
					alert(`Erreur lors de la création de la question ${index + 1}`);
					this.isLoading.set(false);
				}
			});
		});
	}

	private finishQuizCreation() {
		alert('Quiz publié avec succès !');
		this.resetForm();
		this.isLoading.set(false);
	}

	private mapToCreateQuizDto() {
		const q = this.quizData();
		const difficulty = (q.difficulty || '').toString().toUpperCase();
		const difficultyEnum = difficulty.includes('FAC') ? 'FACILE' : difficulty.includes('DIFF') ? 'DIFFICILE' : 'MOYEN';
		return {
			title: q.title,
			description: q.description,
			categoryId: q.category || 'general',
			difficulty: difficultyEnum,
			isPublic: !!q.isPublic,
			allowComments: !!q.allowComments,
		};
	}

	private resetForm() {
		this.quizData.set({
			title: '',
			description: '',
			category: '',
			difficulty: '',
			isPublic: true,
			allowComments: true,
			questions: [
				{ text: '', type: 'simple', mediaUrl: '', orderItems: [], answers: [
					{ text: '', isCorrect: false },
					{ text: '', isCorrect: false },
					{ text: '', isCorrect: false },
					{ text: '', isCorrect: false },
				] }
			]
		});
	}
}
