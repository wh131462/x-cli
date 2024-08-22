export const appSelectTs = `import { Component } from '@angular/core';
import { appRoutes } from './app.routes';
import { Route, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'yi-form-app-select',
    template: \` <div class="demo-list">
        <div
            class="demo-item"
            *ngFor="let page of pages"
            (click)="navigate(page)">
            {{ page.path }}
        </div>
    </div>\`,
    styleUrls: ['./app.select.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule]
})
export class AppSelectComponent {
    pages = appRoutes.filter((r) => r.path && r.path !== 'app-select');
    constructor(private router: Router) {}
    /**
     * 跳转
     * @param page
     */
    navigate(page: Route) {
        this.router.navigate([page.path]);
    }
}
`;
export const appSelectScss = `.demo-list {
    width: 100%;
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: 10px;
    .demo-item {
        cursor: pointer;
        width: 100px;
        height: 150px;
        padding: 6px 12px;
        border-radius: 6px;
        background-color: rgba(95, 111, 255, 0.08);
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 18px;
        font-family: 'Songti TC', sans-serif;
        font-weight: 400;
        word-break: break-all;
        user-select: none;
        &:hover {
            background-color: #4857e2;
            color: #ffffff;
        }
    }
}
`;

export const appSelectRoutes = `import { Route } from '@angular/router';
import { AppSelectComponent } from './app.select';

export const appRoutes: Route[] = [
    {
        path: '',
        redirectTo: 'app-select',
        pathMatch: 'full'
    },
    {
        path: 'app-select',
        loadComponent: () => AppSelectComponent
    }
];
`