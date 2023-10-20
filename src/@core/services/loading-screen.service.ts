import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { animate, AnimationBuilder, AnimationPlayer, style } from '@angular/animations';
import { NavigationEnd, Router } from '@angular/router';

import { filter, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CoreLoadingScreenService {
  loadingScreenEl: any;
  animationPlayer: AnimationPlayer;

  /**
   * Constructor
   *
   * @param _document
   * @param {Router} _router
   * @param {AnimationBuilder} _animationBuilder
   */
  constructor(
    @Inject(DOCUMENT) private _document: any,
    private _router: Router,
    private _animationBuilder: AnimationBuilder
  ) {
    // Initialize
    this._init();
  }

  // Private methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Initialize
   *
   * @private
   */
  private _init(): void {
    // Get the loading screen element
    this.loadingScreenEl = this._document.body.querySelector('#loading-bg');

    // If loading screen element
    if (this.loadingScreenEl) {
      // Hide it on the first NavigationEnd event
      this._router.events
        .pipe(
          filter(event => event instanceof NavigationEnd),
          take(1)
        )
        .subscribe(() => {
          setTimeout(() => {
            this.hide();
          });
        });
    }
  }

  // Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Show the loading screen
   */
  show(): void {
    document.getElementById("loading-bg").style.display = "block";
    document.body.classList.add('overflow-hidden-bg');
  }

  /**
   * Hide the loading screen
   */
  hide(): void {
    document.getElementById("loading-bg").style.display = "none";
    document.body.classList.remove('overflow-hidden-bg');
  }

  showLoader(id: string): void {
    var element = document.getElementById(id);
    element.classList.add("spinner-loading");
  }

  hideLoader(id: string): void {
    var element = document.getElementById(id);
    element.classList.remove("spinner-loading");
  }
}
