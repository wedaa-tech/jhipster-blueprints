import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SwaggerService } from './swagger.service';
import { SwaggerUIBundle } from 'swagger-ui-dist';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-swagger',
  templateUrl: './swagger.component.html',
  styleUrls: ['./swagger.component.css'],
  encapsulation: ViewEncapsulation.None, // Use ViewEncapsulation.None to disable style encapsulation
})
export class SwaggerComponent implements OnInit {
  service: string = '';
  constructor(private route: ActivatedRoute, private swaggerService: SwaggerService) {}

  ngOnInit(): void {
    this.service = this.route.snapshot.data['service'];
    this.swaggerService.getSwaggerJson(this.service).subscribe((swaggerJson: any) => {
      const ui = SwaggerUIBundle({
        spec: swaggerJson,
        dom_id: '#swagger-ui',
      });
    });
  }
}
