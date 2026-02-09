package com.openclassrooms.starterjwt.services;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;

@ExtendWith(MockitoExtension.class)
public class TeacherServiceTest {

    @Mock
    TeacherRepository teacherRepository;

    @InjectMocks
    TeacherService teacherService;

    @Test
    void findAllTeachersOk() {
        List<Teacher> teachers = new ArrayList<>();
        teachers.add(createTeacherForTest());
        when(teacherRepository.findAll()).thenReturn(teachers);
        List<Teacher> result = assertDoesNotThrow(() -> teacherService.findAll());
        assertEquals(teachers.get(0).getId(), result.get(0).getId());
        assertEquals(teachers.get(0).getFirstName(), result.get(0).getFirstName());
        assertEquals(teachers.get(0).getLastName(), result.get(0).getLastName());
        verify(teacherRepository, times(1)).findAll();
    }

    @Test
    void findTeacherByIdOk() {
        Teacher teacher = createTeacherForTest();
        when(teacherRepository.findById(1L)).thenReturn(java.util.Optional.of(teacher));
        Teacher result = assertDoesNotThrow(() -> teacherService.findById(1L));
        assertEquals(teacher.getId(), result.getId());
        assertEquals(teacher.getFirstName(), result.getFirstName());
        assertEquals(teacher.getLastName(), result.getLastName());
        verify(teacherRepository, times(1)).findById(1L);
    }

    private Teacher createTeacherForTest() {
        Teacher teacher = new Teacher();
        teacher.setId(1L);
        teacher.setFirstName("Test");
        teacher.setLastName("Name");
        return teacher;
    }
}
