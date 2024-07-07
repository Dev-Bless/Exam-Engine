import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment.development';
import { UserStore } from '../../../../store/user/user.store';
import { IResponse } from '../../../../interfaces/response.interface';
import { BackendQuestions, ExamQuestion } from '../../interfaces/question.interface';

@Injectable({
  providedIn: 'root',
})
export class QuestionsService {
  private readonly userStore = inject(UserStore);

  private _httpClient = inject(HttpClient);

  constructor() {}

  public createQuestion(questions: ExamQuestion) {
    const tranformedQuestions = this.transformDataToBackendData(questions);

    return this._httpClient.post<IResponse>(
      `${
        environment.BACKEND_API_BASE_URL
      }/exam-engine/api/v1/teacher/create/new-questions/${this.userStore.userId()}`,
      tranformedQuestions
    );
  }

  transformDataToBackendData(data: ExamQuestion) {
    const backendData: BackendQuestions = {
      questionTitle: data.questionTitle,
      questionInstruction: data.questionInstruction,
      questionStartTime: data.questionStartTime,
      questionEndTime: data.questionEndTime,
      question: data.question.map((value, index) => {
        return {
          id: index,
          text: value.text,
          type: value.type,
          options: value.options.map((option) => option.value),
          correctAnswers: value.correctAnswers,
        };
      }),
      questionReceivers: data.questionReceivers,
    };

    return backendData;
  }
}
