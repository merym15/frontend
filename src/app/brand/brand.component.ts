import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-brand',
  templateUrl: './brand.component.html',
  styleUrls: ['./brand.component.css'] // Corrected from styleUrl to styleUrls
})
export class BrandComponent implements OnInit {
  form!: FormGroup;
  brands: any[] = [];
  isResultLoaded = false;
  currentBrandID = "";

  constructor(private http: HttpClient, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [],
      name: ['', Validators.required],
      category: ['', Validators.required],
      isActive: [false],
      imageUrl: [''], // Added imageUrl control
      option: ['', Validators.required]
    });

    this.getAllBrands();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.form.patchValue({
        imageUrl: file
      });
    }
  }


  getAllBrands() {
    this.http.get("http://localhost:5019/api/Brand/GetAllBrands").subscribe((resultData: any) => {
      this.isResultLoaded = true;
      this.brands = resultData;
    });
  }
  
  save() {
    if (this.form.valid) {
      const bodyData = {
        name: this.form.value.name,
        category: this.form.value.category,
        isActive: this.form.value.isActive,
        imageUrl: this.form.value.imageUrl,
        option: this.form.value.option
      };

      this.http.post("http://localhost:5019/api/Brand/AddBrand", bodyData, {
        headers: { 'Content-Type': 'application/json' }
      }).subscribe(
        (resultData: any) => {
          alert("Brand Registered Successfully");
          this.getAllBrands();
          this.form.reset();
        },
        (error) => {
          console.error("Error occurred while saving brand:", error);
          if (error.status === 400) {
            alert("Validation error: Please check your input.");
          } else {
            alert("An error occurred while saving brand. Please try again later.");
          }
        }
      );
    } else {
      alert("Please fill in all required fields.");
    }
  }
  
  editBrand(brand: any) {
    this.currentBrandID = brand.id;
    this.form.patchValue(brand);
  }

  updateBrand() { // Removed id parameter, using this.currentBrandID instead
    if (this.form.valid && this.currentBrandID) {
      let bodyData = this.form.value;
      this.http.patch(`http://localhost:5019/api/Brand/${this.currentBrandID}`, bodyData).subscribe((resultData: any) => {
        alert("Brand Updated Successfully");
        this.getAllBrands();
        this.form.reset();
        this.currentBrandID = "";
      });
    }
  }

  deleteBrand(id: any) {
    if (confirm("Are you sure you want to delete this brand?")) {
      this.http.delete(`http://localhost:5019/api/Brand/${id}`).subscribe((resultData: any) => {
        alert("Brand Deleted Successfully");
        this.getAllBrands();
      });
    }
  }
}
