import { Component, OnDestroy, OnInit } from '@angular/core';
import { interval, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../../environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export default class HomeComponent implements OnInit, OnDestroy {
  isVisibleText = false;
  isVisibleImage = false;
  textArray = ['Angular Application', 'Generated via WeDaa'];
  projectName = environment.projectName;
  dataPeriod = '1000';
  text = '';
  headerImg = 'assets/logox.png';

  loopNum = 0;
  isDeleting = false;
  delta = 300 - Math.random() * 100;
  index = 1;
  period = 2000;

  ngOnInit(): void {
    this.isVisibleText = true;
    this.isVisibleImage = true;
    this.tick();
    this.startTicker();
  }

  openDocs(): void {
    window.open(environment.wedaaDocs, '_blank');
  }

  private destroy$ = new Subject<void>();

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private startTicker(): void {
    interval(this.delta)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => this.tick());
  }

  private tick(): void {
    const i = this.loopNum % this.textArray.length;
    const fullText = this.textArray[i];
    const updatedText = this.isDeleting
      ? fullText.substring(0, this.text.length - 1)
      : fullText.substring(0, this.text.length + 1);

    this.text = updatedText;

    if (this.isDeleting) {
      this.delta /= 2;
    }

    if (!this.isDeleting && updatedText === fullText) {
      this.isDeleting = true;
      this.index--;
      this.delta = this.period;
    } else if (this.isDeleting && updatedText === '') {
      this.isDeleting = false;
      this.loopNum++;
      this.index = 1;
      this.delta = 500;
    } else {
      this.index++;
    }
  }
}
