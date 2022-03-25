from django import forms

class LoginForm(forms.Form):
      username = forms.CharField(max_length=120,widget=forms.TextInput(attrs={'class':'input'}))
      password = forms.CharField(max_length=120, widget=forms.PasswordInput(attrs={'class':'input'}))

      def clean(self):
            data = self.cleaned_data
            username = data.get('username')
            password = data.get('password')
            # logic for custom validation 
            return data 
